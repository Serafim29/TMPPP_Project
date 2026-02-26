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
        _pc.Price += 1200; 
        return this;
    }

    public IProductBuilder SetRAM(string ram)
    {
        _pc.RAM = ram;
        _pc.Price += 400; 
        return this;
    }

    public IProductBuilder SetGPU(string gpu)
    {
        _pc.GPU = gpu;
        _pc.Price += 2500;
        return this;
    }

    public CustomPC Build()
    {
        CustomPC result = _pc;
        Reset(); 
        return result;
    }
}
