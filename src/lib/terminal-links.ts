const OSC8_OPEN = "\u001b]8;;"
const OSC8_CLOSE = "\u0007"

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const DOMAIN_RE =
	/^(?:www\.)?(?:[A-Z0-9-]+\.)+[A-Z]{2,}(?:\/[^\s]*)?$/i
const URL_RE = /^(https?:\/\/[^\s]+|mailto:[^\s]+)$/i
const LINK_RE =
	/(https?:\/\/[^\s]+|mailto:[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:www\.)?(?:[A-Z0-9-]+\.)+[A-Z]{2,}(?:\/[^\s]*)?)/gi

function trimTrailingPunctuation(value: string) {
	const trailing = value.match(/[),.;!?]+$/)?.[0] ?? ""
	return {
		core: trailing ? value.slice(0, -trailing.length) : value,
		trailing,
	}
}

export function normalizeTerminalHref(value: string) {
	const { core } = trimTrailingPunctuation(value.trim())

	if (!core) return null

	if (EMAIL_RE.test(core)) {
		return `mailto:${core}`
	}

	if (DOMAIN_RE.test(core)) {
		return `https://${core}`
	}

	if (!URL_RE.test(core)) {
		return null
	}

	try {
		const url = new URL(core)
		if (!["http:", "https:", "mailto:"].includes(url.protocol)) {
			return null
		}
		return url.toString()
	} catch {
		return null
	}
}

export function linkifyTerminalText(text: string) {
	return text.replace(LINK_RE, match => {
		const { core, trailing } = trimTrailingPunctuation(match)
		const href = normalizeTerminalHref(core)

		if (!href) return match

		return `${OSC8_OPEN}${href}${OSC8_CLOSE}${core}${OSC8_OPEN}${OSC8_CLOSE}${trailing}`
	})
}

export function isApplePlatform(platform: string) {
	return /(mac|iphone|ipad|ipod)/i.test(platform)
}

export function hasPrimaryLinkModifier(
	event: Pick<MouseEvent, "metaKey" | "ctrlKey">,
	platform: string,
) {
	return isApplePlatform(platform) ? event.metaKey : event.ctrlKey
}
