export default class MediaViewer {
    constructor(container, allowDelete = false) {
        this.container = container;
        this.images = [];
        this.maxImages = 4;
        this.allowDelete = allowDelete;
        this.init();
    }

    init() {
        this.container.classList.add('media-viewer');
        this.createGrid();
    }

    createGrid() {
        this.grid = document.createElement('div');
        this.grid.classList.add('media-grid');
        this.container.appendChild(this.grid);
    }

    createImageContainer() {
        const container = document.createElement('div');
        container.classList.add('image-container');
        return container;
    }

    createDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-button');
        deleteBtn.innerHTML = '×';
        return deleteBtn;
    }

    addImage(imageUrl) {
        if (this.images.length >= this.maxImages) {
            console.warn('No se pueden agregar más imágenes. Máximo permitido: ' + this.maxImages);
            return;
        }

        const img = document.createElement('img');
        img.src = imageUrl;
        img.classList.add('media-item');
        
        // Añadir evento para manejar errores de carga
        img.onerror = () => {
            console.error('Error al cargar la imagen:', imageUrl);
            img.remove();
        };

        const imageContainer = this.createImageContainer();
        imageContainer.appendChild(img);

        if (this.allowDelete) {
            const deleteBtn = this.createDeleteButton();
            deleteBtn.onclick = () => this.removeImage(imageContainer);
            imageContainer.appendChild(deleteBtn);
        }

        this.images.push(imageContainer);
        this.grid.appendChild(imageContainer);
        this.updateGridLayout();
    }

    removeImage(imageContainer) {
        const index = this.images.indexOf(imageContainer);
        if (index > -1) {
            this.images.splice(index, 1);
            imageContainer.remove();
            this.updateGridLayout();
        }
    }

    updateGridLayout() {
        this.grid.className = 'media-grid';
        switch (this.images.length) {
            case 1:
                this.grid.classList.add('single');
                break;
            case 2:
                this.grid.classList.add('double');
                break;
            case 3:
                this.grid.classList.add('triple');
                break;
            case 4:
                this.grid.classList.add('quad');
                break;
        }
    }

    clear() {
        this.images.forEach(container => container.remove());
        this.images = [];
        this.updateGridLayout();
    }
}