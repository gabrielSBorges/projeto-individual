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

      if (this.table.footer.totalVendas > 0) {
        rows.push(["", `Total Vendas: ${this.table.footer.totalVendas}`, `Lucro Total: R$ ${this.valorFormatado(this.table.footer.lucro)}`])
      }
      else {
        rows.push(["", "", "", `Lucro Total: R$ ${this.valorFormatado(this.table.footer.lucro)}`])
      }

      const doc = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: 'A4'
      })

      let img = new Image()
      img.src = './images/logo.png'

      doc.autoTable(columns, rows, {
        startY: doc.pageCount > 1? doc.autoTableEndPosY() + 20 : 4,
        // headStyles: {
        //   valign: 'left'
        // },
        // bodyStyles: {
        //   font:'times',
        //   valign: 'left',
        // },
        didDrawPage: data => {
          if(data.pageCount === 1) {
            doc.setFontSize(10);
            doc.addImage(img, 'PNG', data.settings.margin.left, 1.1, 4.5, 2);
            doc.setFontSize(14)
            doc.text(this.title, data.settings.margin.left + 5, 2.2)
            doc.setFontSize(10);
            doc.text(`Emissão: ${moment().format('DD/MM/YYYY HH:mm')} | Usuário: ${auth.user.nome}`, data.settings.margin.left + 5, 2.7);
            doc.line(data.settings.margin.left, 3, 19.6, 3)
            doc.setFontSize(10);
            doc.text(`${this.table.items.length} LINHAS`, data.settings.margin.left, 3.4);
          }
        }
      })

      doc.save(`${fileName}.pdf`)
    },

    valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
    },

    dataFormatada(data) {
			return moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
		}
  }
}