const url = 'http://localhost:3011';

const transferData = async (url, method = 'GET', data = []) => {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (method != 'GET') {
        options.body = JSON.stringify(data);
    }

    const resp = await fetch(url, options);

    return resp.json()
}

const messageDiv = document.querySelector('.messages');
const messages = (message, status) => {
    let klase = (status === 'success') ? 'alert-success' : 'alert-danger';
    messageDiv.innerHTML = message;
    messageDiv.classList.remove('alert-success', 'alert-danger');
    messageDiv.classList.add('show', klase);
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000)
}

const validator = (fields) => {
    let valid = true;
    let entries = Object.entries(fields);

    if (!fields.products) {
        valid = false
        messages('Nepasirinktas produktas', 'failed');
    }

    entries.forEach(value => {
        if (value[1] == '') {
            valid = false;
            messages('Neužpildyti visi užsakymo formos laukai', 'failed');
            return
        }
    })
    return valid
}

const totalsCalculator = () => {
    let productPrice = 0.00;
    const product = document.querySelector('input[name="products"]:checked');

    if (product === null) {
        messages('Nepasirinktas produktas', 'failed');
        return false
    } else { productPrice = product.getAttribute('data-price'); }

    let select = document.querySelector('select[name="shipping_method"]');
    const shippingMethod = select.options[select.selectedIndex].value;
    const shippingCost = 3.63;
    let calculatedTotal = parseFloat(productPrice);

    if (shippingMethod === 'delivery') {
        calculatedTotal += shippingCost;
    }
    document.querySelector('.totals').textContent = 'Viso mokėti: ' + calculatedTotal.toFixed(2) + ' €';
    document.querySelector('input[name="total"]').value = calculatedTotal.toFixed(2);
}

const newOrderForm = async () => {
    const root = document.querySelector('#newOrderForm');
    const productsContainer = root.querySelector('.productSelect');

    const products = await transferData(url + '/products/show-products');
    let html = '<ul>';

    products.forEach(value => {
        let price = `<span class= "normalPrice">${value.price}</span>`;
        let dataPrice = value.discount_price ? value.discount_price : value.price;

        if (value.discount_price) {
            price = `<span class= "specialPrice">${value.discount_price}</span>
                    <span class= "originalPrice">${value.price}</span>`
        }

        html += `<li>
        <label class="product-card">
        <input type = "radio" data-price = "${dataPrice}" name = "products" class= "bubble" value = "${value._id}">
        <div class= "contents">
            <div class="name">${value.product_name}</div>
            <div class="description">${value.description}</div>
            <div class="price">${price}</div>
        </div>
        </label>
        </li>`
    })

    html += '</ul>'

    productsContainer.innerHTML = html;

    root.querySelector('.checkout-button').addEventListener('click', () => {
        const form = root.querySelector('form');
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData);

        if (validator(formJson)) {
            transferData(url + '/orders/save-order', 'POST', formJson)
                .then(resp => {
                    messages(resp.message, resp.status);
                    document.querySelectorAll('.filled').forEach(input => {
                        input.value = '';
                    })
                    showOrders();
                    document.querySelector(".order-list").setAttribute('class', 'show');
                })
        }
    })

    root.querySelectorAll('input[name="products"]').forEach(prod => {
        prod.addEventListener('click', () => {
            totalsCalculator()
        })
    })

    root.querySelector('select[name="shipping_method"]').addEventListener('click', () => {
        totalsCalculator()
    })
}

const showOrders = async () => {
    const root = document.querySelector('#order-list');

    const orders = await transferData(url + '/orders/show-orders');
    let html = '<ul class = "order-list"><h1 class= "title bottom">Jūsų užsakymai</h1>';

    orders.forEach(value => {
        html += `<li>
        <label class="order-card">
        <div class= "contents">
        <div class="name"><span class="label">Vardas, pavardė: </span>${value.first_name} ${value.last_name}</div>
        <div class="address"><span class="label">Adresas: </span>${value.address}, ${value.city}, ${value.post_code}</div>
        <div class="contacts"><span class="label">El.paštas: </span>${value.email}</div> 
        <div class="contacts"><span class="label">Tel: </span>${value.phone}</div>
        <div class="order-details"><span class="label">Pristatymo būdas: </span>${value.shipping_method}</div>
        <div class="order-details"><span class="label">Atsiskaitymo būdas: </span>${value.payment_method}</div>
        <div class="product-ordered"><span class="label">Užsakytas produktas: </span>${value.products}</div>
        <div class="sum"><span class="label">Užsakymo suma: </span>${value.total} €</div>
        <button class="btn btn-delete btn-dark" id = "${value._id}">Panaikinti užsakymą</button>
        </div>
        </label>
        </li>`
    })

    html += '</ul>'

    root.innerHTML = html;

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (event) => {
            let element = event.target;
            let info = element.getAttribute('id');
            infoJson = { id: info };
            transferData(url + '/orders/delete-orders', 'DELETE', infoJson)
                .then(resp => {
                    showOrders();
                    messages("Užsakymas sėkmingai ištrintas", "success");
                })
        })
    })

}


document.querySelector('.add-new-order').addEventListener('click', (event) => {
    const element = event.target;
    const activeLabel = element.getAttribute('data-active-label');
    const hiddenLabel = element.getAttribute('data-hidden-label');
    const root = document.querySelector('#newOrderForm');

    element.textContent = root.classList.contains('show') ? hiddenLabel : activeLabel;

    root.classList.toggle('show');

    if (document.querySelector("#order-list").classList.contains('show')) {
        document.querySelector("#order-list").classList.remove("show");
    }

    newOrderForm();
})


