export class Property{

    //Properties of each Node
    address: string;
    price: number = 0;
    land_value: number = 0;
    land_size: number = 0;
    sale_value: number = 0;

    //Constructor for Property Class
    constructor(add: string, p: number, l_val: number, l_s: number, s_v: number) {
        this.address = add;
        this.price = p;
        this.land_value = l_val;
        this.land_size = l_s;
        this.sale_value = s_v;
    }
}