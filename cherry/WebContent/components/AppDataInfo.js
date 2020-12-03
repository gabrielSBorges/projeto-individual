const template = /*html*/`

	<div>
    <span class="d-block" style="font-size: 12px; color: #959595;">{{ title }}:</span>
    <span class="text-subtitle-1" style="font-size: 14px; color: #202020;">{{ description }}</span>
  </div>

`

export default {
	template,
	props: {
    title: { type: [String, Number], default: '' },
    description: { type: [String, Number], default: '' }
	}
}