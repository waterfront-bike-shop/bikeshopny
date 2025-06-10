print("$$$$ Price Maker $$$$")

price = 0

for i in range(1,32):
    if i <= 7:
        price += 35
    if i > 7:
        price += 12.5
    print(f"Day {i}: ${price:.2f}")
