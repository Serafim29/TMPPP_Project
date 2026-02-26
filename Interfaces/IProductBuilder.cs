public interface IProductBuilder
{
    IProductBuilder SetCPU(string cpu);
    IProductBuilder SetRAM(string ram);
    IProductBuilder SetGPU(string gpu);
    CustomPC Build();
}
