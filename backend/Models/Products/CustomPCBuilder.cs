using System;

public class CustomPCBuilder : IProductBuilder
{
    private CustomPC _pc;
    private static readonly Random _random = new Random();

    public CustomPCBuilder()
    {
        Reset();
    }

    public void Reset()
    {
        _pc = new CustomPC(_random.Next(1000, 9999), "Custom Desktop", 0);
    }

    public IProductBuilder SetCPU(string cpu)
    {
        _pc.CPU = cpu;
        _pc.Price += cpu switch
        {
            "Intel i5" => 200,
            "Intel i7" => 300,
            "Intel i9" => 500,
            "AMD Ryzen 5" => 180,
            "AMD Ryzen 9" => 450,
            _ => 200
        };
        return this;
    }

    public IProductBuilder SetRAM(string ram)
    {
        _pc.RAM = ram;
        _pc.Price += ram switch
        {
            "8GB" => 40,
            "16GB" => 80,
            "32GB" => 150,
            "64GB" => 300,
            _ => 80
        };
        return this;
    }

    public IProductBuilder SetGPU(string gpu)
    {
        _pc.GPU = gpu;
        _pc.Price += gpu switch
        {
            "GTX 1660" => 200,
            "RTX 3060" => 350,
            "RTX 4070" => 600,
            "RTX 4090" => 1600,
            "RX 7900 XTX" => 1000,
            _ => 350
        };
        return this;
    }

    public CustomPC Build()
    {
        CustomPC result = _pc;
        Reset(); 
        return result;
    }
}
