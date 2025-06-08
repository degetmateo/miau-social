import Alert from "../../components/alert/alert.js";
import Header from "../../components/header/Header.js";
import Input from "../../components/input/input.js";
import MemberCard from "../../components/member-card/MemberCard.js";
import Nav from "../../components/nav/Nav.js";
import Spinner from "../../components/spinner/Spinner.js";
import TabList from "../../components/tab-list/TabList.js";
import View from "../../components/view/View.js";
import {URL_NO_IMAGE} from "../../consts.js";
import {formatContent, importCSS, loadImage, Scroll} from "../../helpers.js";
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
        this.header.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setScroll(0);
        });
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
            router.navigateTo(`/explore?search=${encodeURIComponent(this.input.value.trim())}&filter=${this.queries[this.i]?.filter || 'posts'}`);
        });

        this.tablist = new TabList();
        this.main.append(this.tablist);

        this.tablist.add({
            name: 'Publicaciones',
            value: 'posts',
            onClick: () => {
                window.dispatchEvent(new CustomEvent('explore-tablist-changed', {
                    detail: {
                        filter: 'posts'
                    }
                }));
            }
        });

        this.tablist.add({
            name: 'Miembros',
            value: 'members',
            onClick: () => {
                window.dispatchEvent(new CustomEvent('explore-tablist-changed', {
                    detail: {
                        filter: 'members'
                    }
                }));
            }
        });

        window.addEventListener('explore-tablist-changed', (e) => {
            router.navigateTo(`/explore?search=${encodeURIComponent(this.input.value.trim())}&filter=${e.detail.filter}`);
        });

        this.resultsContainer = document.createElement('div');
        this.resultsContainer.classList.add('explore-results');
        this.main.append(this.resultsContainer);

        this.fetching = false;
        this.queries = new Array();
        this.i = 0;
        
        Scroll({
            element: this.view,
            scroll: (s) => {
                this.queries[this.i].scroll = s;
            },
            bottom: () => {
                this.search();
            }
        });
    };

    async init (_, params) {
        this.setTitle("Explorar");
        this.setView(this.view)
        this.nav.append(Nav);

        this.fetching = false;
        this.resultsContainer.innerHTML = '';

        if (!params || !params.search) {
            this.tablist.style.display = 'none';
            return;
        } else {
            this.tablist.style.display = 'flex';
        };

        this.input.set(params.search);

        let found = false;
        this.i = 0;
        while (this.i < this.queries.length) {
            if (this.queries[this.i].search === params.search && this.queries[this.i].filter === (params.filter || 'posts')) {
                found = true;
                break;
            };
            this.i++;
        };

        if (found) {
            this.resultsContainer.append(this.queries[this.i].results);
            this.tablist.tabs.find(t => t.value === this.queries[this.i].filter)?.select();
            this.setScroll(this.queries[this.i].scroll);
        } else {
            this.setScroll(this.scroll);

            const results = document.createElement('div');
            results.classList.add('explore-results');

            this.queries.push({
                search: params.search,
                filter: params.filter || 'posts',
                results: results,
                offset: 0,
                stop: false,
                scroll: 0
            });

            this.i = this.queries.length - 1;
            this.tablist.tabs.find(t => t.value === this.queries[this.i].filter)?.select();
            this.resultsContainer.append(this.queries[this.i].results);
            this.search();
        };
    };

    async search () {
        if (this.fetching || this.queries[this.i].stop) return;
        this.fetching = true;

        const loader = new Spinner();
        this.resultsContainer.append(loader);

        try {
            const res = await Service.Fetch(`/api/aux/search?search=${this.queries[this.i].search}&offset=${this.queries[this.i].offset}&filter=${this.queries[this.i].filter || 'posts'}`, { method: "GET" });
            if (res.length <= 0) throw new Error("No hay más resultados.");

            if (this.queries[this.i].filter === 'members') {
                for (const member of res) {
                    this.queries[this.i].results.append(new MemberCard(member, { bio: member.bio }));
                };
            };

            if (this.queries[this.i].filter === 'posts') {
                for (const r of res) {
                    this.queries[this.i].results.append(PostsManager.Create(r));
                };
            };

            this.queries[this.i].offset += res.length;
        } catch (error) {
            new Alert(error.message, { error: true });
            this.queries[this.i].stop = true;
        };

        this.fetching = false;
        loader.remove();
    };

    setScroll (scroll) {
        this.view.scrollTop = scroll;
        if (this.queries[this.i]) this.queries[this.i].scroll = scroll;
    };
};