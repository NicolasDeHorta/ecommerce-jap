// VARIABLES //
let cartItems = []
let basketPrice = 0
let subtotal = 0
let tax = parseFloat($('input[name="shipmentType"]:checked').val())
let buyMsg = ""

getItem('https://japdevdep.github.io/ecommerce-api/cart/654.json')

// GETTING THE DATA //
async function getItem(url) {
    showSpinner()
    const response = await fetch(url)
    const data = await response.json()
    let tempId = 0;
    data?.articles.map(product => {
        product.id = "product" + tempId++;
        cartItems.push(product)})
    displayAllProducts(cartItems)
    recalculatePrice()
    hideSpinner()
}

let countryArr = []
countries.map((country) => {
    let countryStr = country.country["country_name"]
    countryStr = countryStr[0].toUpperCase() + countryStr.slice(1,countryStr.length).toLowerCase()
    countryArr.push(countryStr)
})
countryArr.sort() //ordeno alfabeticamente
console.log(countryArr)

let options = "<option value='' disabled selected hidden>Selecciona tu pais...</option>"
for (country of countryArr) {
    options += `
    <option value="">${country}</option>
    `
    $('#country').attr('disabled', false)
    $('#country').html(options) 
}

const getBuyInfo = async () => {
    const response = await fetch(CART_BUY_URL)
    const data = await response.json()
    buyMsg = data.msg 
}


// CART FUNCTIONS //
var displayAllProducts = (arr) =>  {
    let htmlContentToAppend = ""
    arr.map(product => {
        htmlContentToAppend += `
    <div class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col-3">
                <img src=" ${product.src}" alt=" ${product.name} " class="img-thumbnail">
            </div>
            <div class="col">
                <div class="d-flex w-100 justify-content-between">
                    <h4 class="mb-1"> ${product.name} </h4>
                     <small class="text-muted"> <input type="number" class="form-control itemQty" name="${product.name}" id="productCountInput" placeholder="" required="true"  min="0" value="${product.count}"> cantidad</small>
                </div>
                <h5 id="${product.id}" class="mb-1"> ${product.currency} ${product.unitCost} </h5>
                <br><p class="text-muted">Agregado a Carrito </p>
                <button class="btn btn-danger remove-button" name="${product.name}" > Remove item</button>
            </div>
        </div>
    </div>
    `
    })
    $("#cart-items").html(htmlContentToAppend) 

    // EVENT LISTENERS de items del carrito
    $('.itemQty').change((event) => changeQty(event.target.name, event.target.value))
    $('.remove-button').click(event => removeItem(event.target.name))
    
}

var recalculatePrice = () => { 
    tax = parseFloat($('input[name="shipmentType"]:checked').val())
    basketPrice = 0
    subtotal = 0

    cartItems.map(item => {
        basketPrice += parseInt(item.currency == "UYU" ? item.unitCost :  item.unitCost*40)*parseInt(item.count)*tax
        subtotal += parseInt(item.currency == "UYU" ? item.unitCost :  item.unitCost*40)*parseInt(item.count)
    })

    $('#basketPrice').html(`UYU ${Math.round(basketPrice,2)}`)
    $('#subtotal').html(`UYU ${Math.round(subtotal,0)}`)
    $('#shipTax').html(`UYU ${Math.round((tax-1)*subtotal,0)}`)
    for (let id = 0; id < cartItems.length; id++) {

        $(`#product${id}`).html(`${cartItems[id].currency} ${cartItems[id].unitCost * cartItems[id].count}`)
        
    }
}


var changeQty = (id, newQty) => { // cambia la cantidad de items
    cartItems.map(item => {
        item.name == id ? item.count = newQty : null  
        recalculatePrice()
        item.currentSubtotal = item.count * item.unitCost
        
    })
}



var removeItem = (item) => {
    console.log("remove")
    cartItems = cartItems.filter(anItem => anItem.name !== item)
    displayAllProducts(cartItems)
    recalculatePrice()
    console.log(cartItems)
}


// FORM FUNCTIONS //
const buySuccess = () => { //creado con sweetAlert2
    Swal.fire({ 
        title: buyMsg,
        width: 600,
        padding: '3em',
        background: '#fffb url(https://i.pinimg.com/originals/6b/15/25/6b1525302df7a2226bdd0b586712110a.gif) no-repeat center',
        confirmButtonText: 'Wohoo!!',
        
        backdrop: `
          rgba(0,0,123,0.2)
          url("https://static.wixstatic.com/media/a91a55_305800be89114dc2af87bd74a6172b6c~mv2.gif")
          top
        `
      })
      $('#location').val(" ")
      $('#adress').val(" ")
}

const buyNotSuccess = () => { //creado con sweetAlert2
    Swal.fire({ 
        title: "Faltan datos",
        width: 600,
        padding: '3em',
        confirmButtonText: 'Ok',
      })
      $('#location').val(" ")
      $('#adress').val(" ")
}

$('input[name="forma-pago"]').change((e) => {
    $('#save-forma-pago').attr('hidden',true)

    if (e.target.value == "credit-card"){
        let complete = false
        $('#form-credit-card').attr('hidden',false)  
        $('#form-transfer').attr('hidden',true)  
        $('#form-credit-card input').attr('required',true)
        $('#form-transfer input').attr('required',false)
        for (input of $('#form-transfer input')) {
            input.value = null
        }
        $('#form-credit-card input').change(() => {
            count = 0
            for (let input of $('#form-credit-card input')) {
                input.value  ? count++ : null
            }
            (count == 3) ? $('#save-forma-pago').attr('hidden',false) : $('#save-forma-pago').attr('hidden',true)
            
        })

        } else {
        $('#form-credit-card').attr('hidden',true) 
        $('#form-transfer').attr('hidden',false)
        for (input of $('#form-credit-card input')) {
            input.value = null
        }

        $('#form-transfer input').attr('required',true)
        $('#form-credit-card input').attr('required',false)
        $('#form-transfer input').change((e) => {
            e.target.value ? $('#save-forma-pago').attr('hidden',false) : $('#save-forma-pago').attr('hidden',true)
        })
    } 
})

// EVENT LISTENERS de elementos del form
$('#save-forma-pago').click(() =>$('#buyButton').attr('hidden', false) )
$('input[name="shipmentType"]').change(() => recalculatePrice())
$('#buyButton').click(() => $('#location').val() && $('#adress').val() && (($('#card-number').val() && $('#card-vencimiento').val() && $('#card-security').val()) ||   $('#transfer-account').val() ) ? buySuccess() : buyNotSuccess() ) //checkea si estan los campos definidos

