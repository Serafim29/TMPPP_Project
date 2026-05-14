using System;

public interface IDiscountService
{
    double ApplyDiscount(double originalPrice, string discountCode);
}
