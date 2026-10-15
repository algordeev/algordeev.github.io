function report = export_pareto_explorer_data(plannerRoot, outputDir)
%EXPORT_PARETO_EXPLORER_DATA Export real, provenance-preserving final fronts.
% No planner/optimiser is executed or modified. Requires base MATLAB R2024b.
% export_pareto_explorer_data('/path/to/Multi-ASV_Planner')
if nargin < 1, error('Supply the Multi-ASV_Planner repository root.'); end
here = fileparts(mfilename('fullpath'));
if nargin < 2, outputDir = fullfile(here,'data'); end
if ~isfolder(outputDir), mkdir(outputDir); end
oldPath = path; cleanup = onCleanup(@() path(oldPath)); %#ok<NASGU>
addpath(plannerRoot);
reportPath = 'img/Optimization/FleetSizeComparison/fleet_comparison_run_summary.csv';
T = readtable(fullfile(plannerRoot,reportPath),'TextType','string');
assert(all(isfinite(T.FinalCommonHVE)));
lakes = ["E2","E4"]; configs = ["A1R2C2","A2R3X1","A2R3X2"];
groups = {}; lakeData = {}; maxLengthError = 0; maxDensityError = 0;
for lake = lakes
    simRelative = "Saves/Simulation/Sol-"+lake+".mat";
    simulation = load(fullfile(plannerRoot,simRelative));
    assert(all(diff(simulation.tVec)>0));
    lakeIndex = find(lakes==lake);
    for fleet = [2,3]
        for config = configs
            rows = T(T.Lake==lake & T.FleetSize==fleet & T.Configuration==config,:);
            assert(height(rows)==5,'Expected five repeats in each group.');
            rows = sortrows(rows,{'FinalCommonHVE','Repeat'});
            chosen = rows(3,:);
            source = "Saves/Optimization/Stat/"+chosen.File;
            saved = load(fullfile(plannerRoot,source),'logs','params');
            p = saved.params; logs = saved.logs;
            assert(p.numASVs==fleet && strcmp(p.splineType,'local'));
            assert(string(p.simuSolName)+".mat"==simRelative);
            if config=="A1R2C2"
                assert(strcmp(p.refinement,'incremental') && strcmp(p.refineCond,'fixed'));
            else
                assert(strcmp(p.refinement,'variable'));
                expected = 'random'; if config=="A2R3X2", expected='proportional'; end
                assert(strcmp(p.refineXOverType,expected));
            end
            if config=="A1R2C2", F=myFunctionsNSGAII(); else, F=myFunctionsNSGAIII(); end
            generation = find(~cellfun(@isempty,logs.data),1,'last');
            pop = logs.data{generation};
            objectives = cell2mat(cellfun(@(e) reshape(e.objs,1,[]),pop(:),'UniformOutput',false));
            assert(size(objectives,2)==3 && all(isfinite(objectives),'all'));
            feasible = cellfun(@(e) all(isfinite(e.restr)) && all(e.restr<=0),pop(:));
            frontIndex = find(feasible); frontIndex = frontIndex(nondominated(objectives(frontIndex,:)));
            assert(~isempty(frontIndex));
            O = objectives(frontIndex,:);
            lo = min(O,[],1); hi = max(O,[],1); Z = (O-lo)./max(hi-lo,eps);
            [~,balanced] = min(sum(Z.^2,2));
            keep = representativeIndices(Z,balanced,50);
            selected = frontIndex(keep);
            opt = p;
            opt.xCellLog=simulation.xCellLog; opt.IDLog=simulation.IDLog;
            opt.tVec=simulation.tVec; opt.parentCell=simulation.parentCell;
            geomRelative = string(p.geomSurfName);
            if fleet==2 && config==configs(1)
                lakeData{lakeIndex} = exportLake(plannerRoot,lake,geomRelative,simulation,p); %#ok<AGROW>
            else
                assert(lakeData{lakeIndex}.geometry==geomRelative);
                assert(abs(lakeData{lakeIndex}.snapshotHour-p.tStart)<1e-7);
                assert(isequal(lakeData{lakeIndex}.gaussianSigma,p.gaussSig));
                assert(lakeData{lakeIndex}.gaussianAmplitude==p.gaussA);
            end
            solutions = cell(1,numel(selected));
            sourceHash = sha256(fullfile(plannerRoot,source));
            for k=1:numel(selected)
                index=selected(k); e=pop{index}; boats=cell(1,fleet);
                lengths=zeros(1,fleet); durations=lengths; contributions=[];
                for b=1:fleet
                    boat=e.asv{b};
                    assert(all(isfinite([boat.t,boat.x,boat.y,boat.z])));
                    assert(numel(boat.t)==numel(boat.x) && numel(boat.t)==numel(boat.y) && numel(boat.t)==numel(boat.z));
                    assert(all(diff(boat.t)>0) && boat.t(1)==0);
                    boat.pp=F.spline_3D(boat,p.splineType); boat.dpp=F.ppDer(boat.pp);
                    lengths(b)=F.lenInter(boat,[boat.t(1),boat.t(end)]);
                    durations(b)=boat.t(end)-boat.t(1);
                    boat.tt=linspace(boat.t(1),boat.t(end),min(max(round(lengths(b)),50),10000));
                    boat.xx=ppval(boat.pp.x,boat.tt); boat.yy=ppval(boat.pp.y,boat.tt); boat.zz=ppval(boat.pp.z,boat.tt);
                    [~,contribution]=F.concentrInPath(boat,opt);
                    contributions(b,:)=contribution; %#ok<AGROW>
                    % Exact cubic Bezier controls: geometry is retained without downsampling.
                    % Browser renders the plan projection with SVG C commands.
                    t=boat.t; dt=diff(t); vx=ppval(boat.dpp.x,t); vy=ppval(boat.dpp.y,t);
                    a=[boat.x(:),boat.y(:)];
                    c1=a(1:end-1,:)+[vx(1:end-1)',vy(1:end-1)'].*dt(:)/3;
                    c2=a(2:end,:)-[vx(2:end)',vy(2:end)'].*dt(:)/3;
                    boats{b}=struct('start',a(1,:),'destination',a(end,:), ...
                        'segments',[c1,c2,a(2:end,:)],'durationSeconds',durations(b), ...
                        'lengthMetres',lengths(b));
                    assert(max(abs(ppval(boat.pp.x,t)-boat.x))<1e-8);
                    assert(max(abs(ppval(boat.pp.y,t)-boat.y))<1e-8);
                end
                computed=[max(durations),max(lengths),-sum(max(contributions,[],1))];
                err=abs(computed-e.objs);
                assert(err(1)<1e-7 && err(2)<max(1e-5,abs(e.objs(2))*1e-7) && err(3)<1e-8, ...
                    'Objective/trajectory mismatch in %s solution %d: %s',source,index,mat2str(err));
                assert(e.objs(3)<=0);
                maxLengthError=max(maxLengthError,err(2)); maxDensityError=max(maxDensityError,err(3));
                solutions{k}=struct('index',index,'objectives',reshape(e.objs,1,3), ...
                    'densityContribution',-e.objs(3),'boats',{boats}, ...
                    'restrictionMax',max(e.restr),'validationError',computed-e.objs);
            end
            id=lake+"-"+fleet+"-"+config;
            groups{end+1}=struct('id',id,'lake',lake,'fleet',fleet,'configuration',config, ...
                'repeat',chosen.Repeat,'generation',generation,'source',source,'sourceSha256',sourceHash, ...
                'frontFinalCommonHVE',chosen.FinalCommonHVE,'populationCount',numel(pop), ...
                'feasibleCount',sum(feasible),'frontCount',numel(frontIndex), ...
                'normalizationMin',lo,'normalizationMax',hi,'balancedIndex',frontIndex(balanced), ...
                'solutions',{solutions}); %#ok<AGROW>
            fprintf('%s: repeat %d, generation %d, feasible %d, nondominated %d, exported %d\n', ...
                id,chosen.Repeat,generation,sum(feasible),numel(frontIndex),numel(selected));
        end
    end
end
% Choose the default configuration separately for each lake/fleet from the
% mean FINAL front HVE over five repeats. This is exploratory, unequal-budget
% fleet data; no cross-fleet or universal-best claim is made.
defaults={};
for lake=lakes
    for fleet=[2,3]
        means=zeros(1,3);
        for c=1:3, means(c)=mean(T.FinalCommonHVE(T.Lake==lake & T.FleetSize==fleet & T.Configuration==configs(c))); end
        [~,c]=max(means); defaults{end+1}=struct('lake',lake,'fleet',fleet,'configuration',configs(c)); %#ok<AGROW>
    end
end
meta=struct('schemaVersion',1,'approach','Median final common-reference-HVE repeat; final feasible nondominated front.', ...
    'densityTransformation','displayDensity = -objectives(3); model contribution units, not concentration.', ...
    'selection','Equal min-max normalized minimization objectives; minimum Euclidean distance to ideal, first original index breaks ties.', ...
    'downselection','Up to 50: preserve three minimizing extremes and balanced, then greedy farthest-point sampling in normalized 3D objective space.', ...
    'report',reportPath,'reportSha256',sha256(fullfile(plannerRoot,reportPath)), ...
    'defaults',{defaults},'lakes',{lakeData},'groups',{groups});
encoded=jsonencode(meta); output=fullfile(outputDir,'pareto_solutions.json');
fid=fopen(output,'w','n','UTF-8'); assert(fid~=-1); closeFile=onCleanup(@() fclose(fid)); fwrite(fid,encoded,'char'); clear closeFile
report=struct('groups',numel(groups),'solutions',sum(cellfun(@(g)numel(g.solutions),groups)), ...
    'maxLengthErrorMetres',maxLengthError,'maxDensityError',maxDensityError,'jsonBytes',dir(output).bytes);
fid=fopen(fullfile(outputDir,'pareto_solutions.js'),'w','n','UTF-8'); assert(fid~=-1);
fwrite(fid,['window.paretoExplorerData = ' encoded ';'],'char'); fclose(fid);
fid=fopen(fullfile(outputDir,'validation_report.json'),'w'); fwrite(fid,jsonencode(report,PrettyPrint=true)); fclose(fid);
disp(report);
end

function mask=nondominated(O)
mask=true(size(O,1),1);
for i=1:size(O,1), mask(i)=~any(all(O<=O(i,:),2)&any(O<O(i,:),2)); end
end

function keep=representativeIndices(Z,balanced,limit)
[~,extreme]=min(Z,[],1); keep=unique([extreme,balanced],'stable');
while numel(keep)<min(limit,size(Z,1))
    distance=inf(size(Z,1),1);
    for k=keep, distance=min(distance,sum((Z-Z(k,:)).^2,2)); end
    distance(keep)=-inf; [~,next]=max(distance); keep(end+1)=next; %#ok<AGROW>
end
keep=sort(keep);
end

function lake=exportLake(root,scenario,geom,sim,p)
mesh=stlread(fullfile(root,geom)); vertices=mesh.Points(:,1:2);
% STL surface's free boundary includes every shoreline hole.
edges=freeBoundary(mesh); edges=edges(:,1:2);
segments=[vertices(edges(:,1),:),vertices(edges(:,2),:)];
lo=min(vertices,[],1); hi=max(vertices,[],1); nx=128; ny=max(32,round(nx*(hi(2)-lo(2))/(hi(1)-lo(1))));
x=linspace(lo(1),hi(1),nx); y=linspace(lo(2),hi(2),ny); [X,Y]=meshgrid(x,y);
[~,snapshot]=min(abs(sim.tVec-p.tStart));
assert(abs(sim.tVec(snapshot)-p.tStart)<1e-7);
particles=reshape(sim.xCellLog(snapshot,:,:),size(sim.xCellLog,2),3); particles=particles(all(isfinite(particles),2),:);
D=zeros(ny,nx);
for i=1:size(particles,1)
    D=D+p.gaussA*exp(-.5*((X-particles(i,1)).^2/p.gaussSig(1)^2+(Y-particles(i,2)).^2/p.gaussSig(2)^2));
end
peak=max(D,[],'all'); name="Lake Mendota"; if scenario=="E4",name="Lake Campillo";end
lake=struct('id',scenario,'name',name,'geometry',geom,'geometrySha256',sha256(fullfile(root,geom)), ...
    'simulation',"Saves/Simulation/Sol-"+scenario+".mat",'simulationSha256',sha256(fullfile(root,"Saves/Simulation/Sol-"+scenario+".mat")), ...
    'snapshotHour',sim.tVec(snapshot),'snapshotIndex',snapshot,'boundary',segments, ...
    'bounds',[lo,hi],'density',struct('width',nx,'height',ny,'peak',peak, ...
    'values',reshape(round(D/peak*255)',1,[])), ...
    'gaussianSigma',p.gaussSig,'gaussianAmplitude',p.gaussA);
end

function hash=sha256(file)
fid=fopen(file,'r'); assert(fid~=-1); cleanup=onCleanup(@()fclose(fid)); %#ok<NASGU>
md=java.security.MessageDigest.getInstance('SHA-256');
while ~feof(fid), md.update(fread(fid,1048576,'*uint8')); end
hash=lower(reshape(dec2hex(typecast(md.digest(),'uint8'),2)',1,[]));
end
