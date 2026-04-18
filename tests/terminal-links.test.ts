import { expect, test } from "bun:test"
import {
	hasPrimaryLinkModifier,
	isApplePlatform,
	linkifyTerminalText,
	normalizeTerminalHref,
} from "../src/lib/terminal-links.ts"

test("normalizeTerminalHref supports emails urls and bare domains", () => {
	expect(normalizeTerminalHref("kamal@mohiwalla.com")).toBe(
		"mailto:kamal@mohiwalla.com",
	)
	expect(normalizeTerminalHref("https://github.com/mohiwalla")).toBe(
		"https://github.com/mohiwalla",
	)
	expect(normalizeTerminalHref("github.com/mohiwalla")).toBe(
		"https://github.com/mohiwalla",
	)
	expect(normalizeTerminalHref("javascript:alert(1)")).toBeNull()
})

test("linkifyTerminalText wraps links without swallowing punctuation", () => {
	const result = linkifyTerminalText(
		"email: kamal@mohiwalla.com, github: github.com/mohiwalla.",
	)

	expect(result).toContain("\u001b]8;;mailto:kamal@mohiwalla.com\u0007kamal@mohiwalla.com")
	expect(result).toContain("\u001b]8;;https://github.com/mohiwalla\u0007github.com/mohiwalla")
	expect(result.endsWith(".")).toBe(true)
})

test("primary link modifier matches platform", () => {
	expect(isApplePlatform("MacIntel")).toBe(true)
	expect(isApplePlatform("Win32")).toBe(false)
	expect(hasPrimaryLinkModifier({ metaKey: true, ctrlKey: false }, "MacIntel")).toBe(
		true,
	)
	expect(hasPrimaryLinkModifier({ metaKey: false, ctrlKey: true }, "Win32")).toBe(
		true,
	)
	expect(hasPrimaryLinkModifier({ metaKey: false, ctrlKey: false }, "MacIntel")).toBe(
		false,
	)
})
