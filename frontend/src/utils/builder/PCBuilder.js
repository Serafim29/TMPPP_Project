/**
 * BUILDER PATTERN
 * Oglindește CustomPCBuilder.cs din Backend.
 * Permite asamblarea pas cu pas a configurației PC și calculul prețului,
 * eliminând logica de business rigidă din componenta React UI.
 */
export class PCBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.cpu = 'Intel i5';
    this.ram = '16GB';
    this.gpu = 'RTX 3060';
  }

  setCPU(cpu) {
    this.cpu = cpu;
    return this; 
  }

  setRAM(ram) {
    this.ram = ram;
    return this; 
  }

  setGPU(gpu) {
    this.gpu = gpu;
    return this; 
  }

  calculatePrice() {
    let total = 0;

    switch (this.cpu) {
      case 'Intel i5': total += 200; break;
      case 'Intel i7': total += 300; break;
      case 'Intel i9': total += 500; break;
      case 'AMD Ryzen 5': total += 180; break;
      case 'AMD Ryzen 9': total += 450; break;
      default: total += 200; break;
    }

    switch (this.ram) {
      case '8GB': total += 40; break;
      case '16GB': total += 80; break;
      case '32GB': total += 150; break;
      case '64GB': total += 300; break;
      default: total += 80; break;
    }

    switch (this.gpu) {
      case 'GTX 1660': total += 200; break;
      case 'RTX 3060': total += 350; break;
      case 'RTX 4070': total += 600; break;
      case 'RTX 4090': total += 1600; break;
      case 'RX 7900 XTX': total += 1000; break;
      default: total += 350; break;
    }

    return total;
  }

  build() {
    const finalPrice = this.calculatePrice();
    const result = {
      cpu: this.cpu,
      ram: this.ram,
      gpu: this.gpu,
      price: finalPrice,
      name: `Custom PC (${this.cpu} / ${this.ram} / ${this.gpu})`,
      description: `Desktop PC performant configurat special. Procesor: ${this.cpu}, Memorie: ${this.ram}, Placă Video: ${this.gpu}.`
    };
    return result;
  }
}
