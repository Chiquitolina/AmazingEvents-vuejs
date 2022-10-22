const { createApp } = Vue

  createApp({
    data() {
      return {
        eventos: [],
        bkpEventos: [],
        urlApi: 'https://amazing-events.herokuapp.com/api/events',
        categoriasFiltradas : [],
        contenedorCarr: document.getElementById('contenedor-carr'),
        textobuscar : "", 
        categoriasBuscadas: []
      }
    },
    created() {
        this.traerDatos()
    }, 
    mounted() {
        
    },
    methods: {
        traerDatos() {
            fetch(this.urlApi)
            .then(response => response.json())
            .then(data => {
                if (document.title == "Amazing Events") {
                this.eventos = data.events
                } else if (document.title == "Upcoming Events") {
                this.eventos = data.events.filter(evento => evento.date >= data.currentDate ) 
                } else if (document.title == "Past Events") {
                this.eventos = data.events.filter(evento => evento.date < data.currentDate)
                }
                this.bkpEventos = this.eventos
                this.categoriasFiltradas = this.filtrarCategorias()
            })
        },
        filtrarCategorias() {
            categoriasFiltradas = []
            this.eventos.forEach(evento => {
                if(!categoriasFiltradas.includes(evento.category)) {
                    categoriasFiltradas.push(evento.category)
                }
            })
            return categoriasFiltradas;
        },

    },
    
    computed: {
        superFiltro() {
            let filtro1 = this.bkpEventos.filter(evento => evento.name.toLowerCase().includes(this.textobuscar.toLowerCase()))

            let filtro2 = filtro1.filter(evento => this.categoriasBuscadas.includes(evento.category))

            if (filtro2.length > 0) {
                this.eventos = filtro2
            } else {
                this.eventos = filtro1
            }


        }
    }
  }).mount('#app')