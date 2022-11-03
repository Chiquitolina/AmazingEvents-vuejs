const { createApp } = Vue

createApp({
    data() {
        return {
            eventos: [],
            bkpEventos: [],
            eventosPAST: [],
            eventosUP: [],
            urlApi: 'https://amazing-events.herokuapp.com/api/events',
            categoriasFiltradas: [],
            contenedorCarr: document.getElementById('contenedor-carr'),
            textobuscar: "",
            categoriasBuscadas: [],
            evento: {},
            primerTabla: [],
            segundaTabla: "",
            terceraTabla: "",
            tituloPagina: document.title
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
                        this.eventos = data.events.filter(evento => evento.date >= data.currentDate)
                    } else if (document.title == "Past Events") {
                        this.eventos = data.events.filter(evento => evento.date < data.currentDate)
                    } else if (document.title == "Details") {
                        this.eventos = data.events

                        let id = new URLSearchParams(location.search).get('_id')

                        this.evento = this.eventos.find(evento => evento._id == id)
                    } else if (document.title == "Stats") {

                        this.eventos = data.events
                        this.categoriasFiltradas = this.filtrarCategorias(this.eventos)
                        this.eventosPAST = this.eventos.filter(evento => evento.date < data.currentDate)

                        this.eventosUP = this.eventos.filter(evento => evento.date > data.currentDate)

                        let eventosordenados = this.eventosPAST.sort((a, b) => ((b.assistance * 100) / b.capacity) - ((a.assistance * 100) / a.capacity))

                        this.primerTabla.push(eventosordenados[0].name)

                        this.primerTabla.push(eventosordenados[eventosordenados.length - 1].name)

                        this.primerTabla.push(this.eventos.sort((a, b) => b.capacity - a.capacity)[0].name)
                        this.segundaTabla = this.statsporCategoria(this.eventosUP)

                        this.terceraTabla = this.statsporCategoria(this.eventosPAST)
                        console.log(this.terceraTabla)
                    }

                    else {
                        this.eventos = data.events
                    }
                    this.bkpEventos = this.eventos
                    this.categoriasFiltradas = this.filtrarCategorias(this.eventos)

                })
        },
        filtrarCategorias(eventos) {
            categoriasFiltradas = []
            eventos.forEach(evento => {
                if (!categoriasFiltradas.includes(evento.category)) {
                    categoriasFiltradas.push(evento.category)
                }
            })
            return categoriasFiltradas;
        },
        statsporCategoria(eventos) {
            let objetos = []
            let categorias = []
            let revenues = []
            let percents = []
            this.categoriasFiltradas.forEach(categoria => {

                let filtradosCategoria = eventos.filter(
                    (evento) => evento.category == categoria
                );
                if (filtradosCategoria.length > 0) {
                    categorias.push(categoria)
                    revenues.push(filtradosCategoria
                        .map(evento => evento.price * (evento.assistance ? evento.assistance : evento.estimate))
                        .reduce((accu, ele) => accu + ele))

                    percents.push(filtradosCategoria
                        .map(evento => parseInt((((evento.assistance ? evento.assistance : evento.estimate))) * 100) / evento.capacity)
                        .reduce((ac, e) => ac + e) / filtradosCategoria.length
                    )
                }
            })
            for (let i = 0; i < categoriasFiltradas.length; i++) {
                let objeto = {
                    nombre: categorias[i],
                    revenue: revenues[i],
                    percent: percents[i]
                }
                objetos.push(objeto)
            }
            return objetos;
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