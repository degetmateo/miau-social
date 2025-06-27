import Nav from "../../components/nav/Nav.js";
import View from "../../components/view/View.js";
import Helper from "../../Helper.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/terms-and-conditions/terms-and-conditions.css');

export default class TermsConditionsView extends AbstractView {
    constructor () {
        super();
        this.view = new View();
        this.view.classList.add('tc-view');
        this.main = document.createElement('main');
        this.main.classList.add('tc-main');
        this.view.append(this.main);

        this.main.innerHTML = `
            <h1 class="tc-title">Términos y Condiciones</h1>
            
            <div class="tc-block">
                <p class="tc-p">Última actualización: 27 de junio de 2025</p>
                <p>Al crearte una cuenta en social-miau.onrender.com, estás aceptando los siguientes términos y condiciones:</p>
            </div>

            <div class="tc-block">
                <h2 class="tc-st">1. Privacidad y Protección de Datos</h2>
                <p class="tc-p">Solo recopilamos tu correo electrónico.</p>
                <p class="tc-p">El correo electrónico se utilizará únicamente para activar tu cuenta y permitir la recuperación del acceso.</p>
                <p class="tc-p">No compartiremos ni venderemos tus datos personales a terceros.</p>
                <p class="tc-p">Usted es responsable de mantener la confidencialidad de su contraseña y otros datos personales.</p>
            </div>

            <div class="tc-block">
                <h2 class="tc-st">2. Contenido Generado por el Usuario</h2>
                <p class="tc-p">Usted es el único responsable del contenido que usted publica en la plataforma.</p>
                <p class="tc-p">No se permite contenido ilegal o que viole los derechos de terceros.</p>
            </div>

            <div class="tc-block">
                <h2 class="tc-st">3. Uso Aceptable de la Plataforma</h2>
                <p class="tc-p">No se permite el uso de la plataforma para actividades ilegales, spam o acoso.</p>
                <p class="tc-p">Usted se compromete a no utilizar la plataforma para difundir virus, malware o cualquier otro tipo de software malicioso.</p>
                <p class="tc-p">El acceso automatizado (bots, scrapers, etc.) no está permitido.</p>
            </div>
            
            <div class="tc-block">
                <h2 class="tc-st">4. Limitación de Responsabilidad</h2>
                <p class="tc-p">Usás la plataforma bajo tu propia responsabilidad: Podemos interrumpir o modificar el servicio en cualquier momento, con o sin aviso previo, y tampoco garantizamos que el servicio esté libre de errores.</p>
                <p class="tc-p">No nos hacemos responsables por daños directos o indirectos derivados del uso del sitio.</p>
            </div>

            <div class="tc-block">
                <p class="tc-p tc-p-b">Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos.</p>
                <p class="tc-p tc-p-b">Nos reservamos el derecho de eliminar cualquier contenido o cuentas que consideremos inapropiados.</p>
            </div>
        `;
    };

    init () {
        this.setTitle("Términos y Condiciones");
        this.setView(this.view);
    };
};