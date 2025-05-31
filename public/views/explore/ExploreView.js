import Alert from "../../components/alert/alert.js";
import Header from "../../components/header/Header.js";
import Input from "../../components/input/input.js";
import Nav from "../../components/nav/Nav.js";
import Spinner from "../../components/spinner/Spinner.js";
import View from "../../components/view/View.js";
import {formatContent, importCSS, Scroll} from "../../helpers.js";
import PostsManager from "../../modules/PostsManager.js";
import Service from "../../modules/Service.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/explore/explore.css');

export default class ExploreView extends AbstractView {
    constructor () {
        super();
        this.view = new View();
        this.view.classList.add('explore-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('explore-main');
        this.view.append(this.main);

        this.header = new Header({ text: 'Explorar' });
        this.main.append(this.header);

        this.form = document.createElement('form');
        this.form.classList.add('explore-search');
        this.main.append(this.form);

        this.input = new Input({
            title: '¿Qué buscás?',
            type: 'type',
            autocomplete: 'off',
            min: 0,
            max: 512,
            length: false,
            placeholder: null
        });
        this.form.append(this.input.render());

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            router.navigateTo(`/explore?query=${encodeURIComponent(this.input.value.trim())}`);
        });

        this.results = document.createElement('div');
        this.results.classList.add('explore-results');
        this.main.append(this.results);


        this.stop = false;
        this.fetching = false;
        this.scroll = 0;
        this.params = null;
        this.previous = null;
        this.offset = 0;

        Scroll({
            element: this.view,
            scroll: (s) => {
                this.scroll = s;
            },
            bottom: async () => {
                console.log('test');
                if (this.fetching || this.stop) return;
                this.fetching = true;
                await this.search();
                this.fetching = false;
            }
        });
    };

    async init (_, params) {
        this.setTitle("Explorar");
        this.setView(this.view)
        this.nav.append(Nav);
        this.setScroll(this.scroll);

        this.params = params;
        this.fetching = false;
        this.stop = false;

        if (params && params.query) {
            this.input.set(params.query);

            if (this.previous && this.previous.query === params.query) {
                return;
            };

            this.previous = params.query;
            this.results.innerHTML = '';
            this.offset = 0;
            await this.search();
        };
    };

    async search () {
        if (!this.params || !this.params.query) return;

        const loader = new Spinner();
        this.results.append(loader);

        try {
            const res = await Service.Fetch(`/api/aux/search?query=${this.params.query}&offset=${this.offset}`, { method: "GET" });
            if (res.length <= 0) throw new Error("No hay más resultados.");

            for (const r of res) {
                this.results.append(PostsManager.Create(r));
            };

            this.offset += res.length;
        } catch (error) {
            new Alert(error.message, { error: true });
            this.stop = true;
        };

        loader.remove();
    };

    setScroll (scroll) {
        this.view.scrollTop = scroll;
    };
};