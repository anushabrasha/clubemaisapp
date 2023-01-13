import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShopControlService {
  isCnova = false;

  constructor(
    private events: Events,
  ) { }

  updateCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let preventAddToCart = false;
    let message = '';
    let returnData: any = {};

    if (cart && cart.length) {

    } else {
      cart = [];
    }

    cart.forEach(element => {
      if (element.id == product.id) {
        message = "Produto já presente no carrinho.";
        preventAddToCart = true;
      }

      if(product){
        message = "Não é possível adicionar este produto no atual carrinho. Processe o carrinho antes.";
        preventAddToCart = true;
      }
      // if (element.sbProductType == 'para-ajudar') {

      // } else if ((element.sbProductType != product.sbProductType) && (product.sbProductType != 'para-ajudar')) {
      //   message = "Você não pode adicionar outro produto de categoria, conclua o pedido no carrinho.";
      //   preventAddToCart = true;
      // }

      if (element.sbProductType != product.sbProductType) {
        message = "Você não pode adicionar outro produto de categoria, conclua o pedido no carrinho.";
        preventAddToCart = true;
      }
    });

    if (preventAddToCart) {
      returnData.isAllowed = false;
      returnData.message = message;
      return returnData;
    }
    cart.push(product);
    let Stringified = JSON.stringify(cart);
    localStorage.setItem('cart', Stringified);
    this.events.publish('footer:updateCart', "");
    returnData.isAllowed = true;
    return returnData;
  }

  emptyCart() {
    localStorage.removeItem('cart');
    localStorage.removeItem('updatedCPF');
    localStorage.removeItem('totalCnovaFrete');
    this.events.publish('footer:updateCart', "");
  }

  getCartDetails() {
    let details = JSON.parse(localStorage.getItem('cart'));
    if (details && details.length) {
      return details;
    } else {
      return false;
    }
  }

  resetCart(list) {
    let Stringified = JSON.stringify(list);
    localStorage.setItem('cart', Stringified);
    this.events.publish('footer:updateCart', "");
  }

  getCartCount() {
    let details = JSON.parse(localStorage.getItem('cart'));
    if (details && details.length) {
      return details.length;
    } else {
      return 0;
    }
  }

  getCartTotal() {
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || !cart.length) {
      return {};
    }

    let totalPoints = 0;
    let totalCurrency = 0;
    let totalFrete = 0;
    let totalWithFrete = 0;
    cart.forEach(element => {
      totalPoints = totalPoints + parseFloat(element.selectedPoints);
      totalCurrency = totalCurrency + (parseFloat(element.currency) ? parseFloat(element.currency) : 0);
      if (this.isCnova) {
        totalFrete = JSON.parse(localStorage.getItem('totalCnovaFrete'));
      } else {
        totalFrete += parseFloat(element.frete) ? parseFloat(element.frete) : 0;
      }
    });
    totalWithFrete = totalFrete + totalPoints;
    let returnData = {
      points: totalPoints,
      currency: totalCurrency,
      frete: totalFrete,
      totalWithFrete: totalWithFrete
    }
    return returnData;
  }

  checkIfGiffty(list) {
    let isGiftty = false;
    if (!list.length) {
      return isGiftty;
    }
    list.forEach(element => {
      if (element.product_type == 'giftty') {
        isGiftty = true;
      }
    });
    return isGiftty;
  }

  concatGiftyFrete(freteList, cartList) {
    let localData = cartList;
    this.isCnova = false;
    freteList.forEach((element, index) => {
      if (element.product_id == localData[index].id) {
        if (element.frete) {
          localData[index].frete = parseFloat(element.frete);
        }
      }
    });
    let Stringified = JSON.stringify(localData);
    localStorage.setItem('cart', Stringified);
    this.events.publish('cart:getCartData');
  }

  checkIfCnova(list) {
    this.isCnova = false;
    if (!list.length) {
      return this.isCnova;
    }
    list.forEach(element => {
      if (element.product_type == 'cnova') {
        this.isCnova = true;
      }
    });
    return this.isCnova;
  }

  concatCnovaFrete(frete, userConversionFactor) {
    let freteTotal = parseFloat(frete) * parseFloat(userConversionFactor);
    let Stringified = JSON.stringify(freteTotal);
    localStorage.setItem('totalCnovaFrete', Stringified);
    this.events.publish('cart:getCartData');
  }
}
