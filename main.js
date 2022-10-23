const { createApp } = Vue

  createApp({
    data() {
      return {
        eventos: [],
        bkpEventos: [],
        eventosPAST: [],
        urlApi: 'https://amazing-events.herokuapp.com/api/events',
        categoriasFiltradas : [],
        contenedorCarr: document.getElementById('contenedor-carr'),
        textobuscar : "", 
        categoriasBuscadas: [],
        evento: {},
        primerTabla: []
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
                } else {
                this.eventos = data.events
                }
                this.bkpEventos = this.eventos
                this.categoriasFiltradas = this.filtrarCategorias()

                this.eventosPAST = this.eventos.filter(evento => evento.date < data.currentDate)

                let id = new URLSearchParams(location.search).get('_id')
                this.evento = this.eventos.find(evento => evento._id == id)

                this.filtrarEventoMayorMenorAsistencia()
                this.filtrarEventoMayorCapacidad()
                console.log(this.primerTabla)

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
        filtrarEventoMayorCapacidad() {
            let evento = this.eventos.sort((a, b)=> b.capacity-a.capacity)[0].name
            this.primerTabla.push(evento)

            return evento;
        },
        filtrarEventoMayorMenorAsistencia() {
            let eventosordenados = this.eventosPAST.sort((a,b) => ((b.assistance*100)/b.capacity)-((a.assistance*100)/a.capacity))
            this.primerTabla.push(eventosordenados[eventosordenados.length-1].name)
            this.primerTabla.push(eventosordenados[0].name)
            return 0
        }
       

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