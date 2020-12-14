const template = /*html*/`
	
	<div>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn
					outlined
					color="red lighten-1"
          @click="exportPDF"
          v-on="on"
          class="px-2"
				>
          Exportar
          <v-icon class="ml-2">mdi-file-pdf</v-icon>
				</v-btn>
			</template>

			<span>Exportar a tabela para PDF</span>
		</v-tooltip>
	</div>

`

export default {
	template,
	props: {
    title: { type: String, required: true },
    table: { type: Object, required: true }
  },
  methods: {
    exportPDF() {
      const date = moment().format(" DD MM YYYY HH mm ss")
      const fileName = (this.title + date).replace(/\s/g, "_")

      const columns = this.table.headers.map(column => {
        return column.text
      })

      const rows = this.table.items.map(item => {
        let row = []
        
        for (const i in item) {
          if (i !== "id") {
            if (i == "valor_unit" || i == "valor_total" || i == "total") {
              row.push(`R$ ${this.valorFormatado(item[i])}`)
            }
            else if (i == "data") {
              row.push(this.dataFormatada(item[i]))
            }
            else {
              row.push(item[i])
            }
          }
        }
        
        return row
      })

      const doc = new jspdf.jsPDF()
      doc.autoTable(columns, rows);
      doc.save(`${fileName}.pdf`);
    },

    valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
    },

    dataFormatada(data) {
			return moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
		}
  }
}