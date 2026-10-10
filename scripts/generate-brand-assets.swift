// Run from the repository root:
// swift -module-cache-path /tmp/portfolio-swift-cache scripts/generate-brand-assets.swift
import AppKit
import Foundation

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
func color(_ hex: String) -> NSColor {
    let n = UInt32(hex.dropFirst(), radix: 16)!
    return NSColor(srgbRed: CGFloat((n >> 16) & 255) / 255, green: CGFloat((n >> 8) & 255) / 255, blue: CGFloat(n & 255) / 255, alpha: 1)
}
func box(_ x: CGFloat, _ top: CGFloat, _ w: CGFloat, _ h: CGFloat, _ hex: String, _ height: CGFloat, radius: CGFloat = 0) {
    color(hex).setFill()
    let rect = NSRect(x: x, y: height - top - h, width: w, height: h)
    NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius).fill()
}
func text(_ value: String, _ x: CGFloat, _ top: CGFloat, _ size: CGFloat, _ hex: String, _ height: CGFloat, weight: NSFont.Weight = .regular) {
    let attrs: [NSAttributedString.Key: Any] = [.font: NSFont.systemFont(ofSize: size, weight: weight), .foregroundColor: color(hex)]
    let line = value as NSString
    let bounds = line.size(withAttributes: attrs)
    line.draw(at: NSPoint(x: x, y: height - top - bounds.height), withAttributes: attrs)
}
func png(_ width: Int, _ height: Int, _ name: String, _ draw: () -> Void) throws {
    let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    NSGraphicsContext.current!.imageInterpolation = .none
    draw()
    NSGraphicsContext.restoreGraphicsState()
    try bitmap.representation(using: .png, properties: [:])!.write(to: root.appendingPathComponent(name))
}
// Simple AG monograms stay readable at browser-tab sizes.
for (size, file) in [(32, "assets/favicon-32.png"), (180, "assets/apple-touch-icon.png")] {
    try png(size, size, file) {
        let side = CGFloat(size)
        box(0, 0, side, side, "#2455e0", side, radius: side * 0.22)
        let attrs: [NSAttributedString.Key: Any] = [.font: NSFont.systemFont(ofSize: side * 0.47, weight: .bold), .foregroundColor: NSColor.white]
        let initials = "AG" as NSString
        let bounds = initials.size(withAttributes: attrs)
        initials.draw(at: NSPoint(x: (side - bounds.width) / 2, y: (side - bounds.height) / 2), withAttributes: attrs)
    }
}
let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect width=\"64\" height=\"64\" rx=\"14\" fill=\"#2455e0\"/><text x=\"32\" y=\"43\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"700\" fill=\"white\">AG</text></svg>\n"
try svg.write(to: root.appendingPathComponent("assets/favicon.svg"), atomically: true, encoding: .utf8)
// PNG-backed ICO provides the conventional /favicon.ico fallback.
let icon = try Data(contentsOf: root.appendingPathComponent("assets/favicon-32.png"))
var ico = Data([0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0])
func littleEndian(_ n: UInt32) -> Data { var n = n.littleEndian; return withUnsafeBytes(of: &n) { Data($0) } }
ico.append(littleEndian(UInt32(icon.count))); ico.append(littleEndian(22)); ico.append(icon)
try ico.write(to: root.appendingPathComponent("favicon.ico"))
try png(1200, 630, "assets/social-card.png") {
    let h: CGFloat = 630
    box(0, 0, 1200, h, "#fafaf8", h)
    box(64, 70, 44, 6, "#2455e0", h, radius: 3)
    text("ROBOTICS · EMBEDDED SYSTEMS", 64, 112, 19, "#2455e0", h, weight: .semibold)
    text("Aleksandr", 60, 184, 74, "#1b1d21", h, weight: .bold)
    text("Gordeev", 60, 266, 74, "#1b1d21", h, weight: .bold)
    text("Building autonomous systems.", 64, 382, 27, "#5f6672", h)
    text("algordeev.github.io", 64, 520, 20, "#2455e0", h, weight: .medium)
    let photo = NSImage(contentsOf: root.appendingPathComponent("assets/me.jpg"))!
    let frame = NSRect(x: 760, y: h - 94 - 442, width: 376, height: 442)
    let scale = max(frame.width / photo.size.width, frame.height / photo.size.height)
    let crop = NSRect(x: (photo.size.width - frame.width / scale) / 2,
                      y: (photo.size.height - frame.height / scale) / 2,
                      width: frame.width / scale, height: frame.height / scale)
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(roundedRect: frame, xRadius: 30, yRadius: 30).addClip()
    NSGraphicsContext.current!.imageInterpolation = .high
    photo.draw(in: frame, from: crop, operation: .sourceOver, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()
}
print("Created SVG/PNG/ICO favicons, Apple touch icon, and 1200 × 630 social card.")
