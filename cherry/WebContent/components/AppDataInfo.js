const template = /*html*/`

	<div>
    <span class="d-block" style="font-size: 12px; font-weight: bold;">{{ title }}:</span>
    <span class="text-subtitle-1" style="font-size: 14px;">{{ description }}</span>
  </div>

`

export default {
	template,
	props: {
    title: { type: [String, Number], default: '' },
    description: { type: [String, Number], default: '' }
	}
}