# Defectos

| Regla | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| Descuento | Ingresar con `estandar`, agregar Molino manual y 2 Café de Huehuetenango 250 g (subtotal Q500), pagar con CP 01001 | Descuento de 10 % (Q50.00), total Q450.00 | Descuento de 5 % (Q25.00), total Q475.00 |
| Envío gratis | Ingresar con `estandar`, agregar Café de Huehuetenango 250 g, pagar con CP 02010 y cupón `ENVIOGRATIS` | Envío Q0.00 | Envío Q40.00 |
| Catálogo | Ingresar con `problema`, ordenar por precio de menor a mayor | Precios 25, 60, 75, 140, 225, 350 | El orden no cambia |
| Catálogo | Ingresar con `problema`, ordenar por precio de mayor a menor | Precios 350, 225, 140, 75, 60, 25 | El orden no cambia |
| Carrito | Ingresar con `problema`, agregar Taza de barro | La taza queda en el carrito | Se agregan Filtros de papel (100) |
| Datos de envío | Ingresar con `problema`, agregar un producto, llenar nombre, apellido y CP 01001, continuar | Pasa al resumen | Muestra "Falta el apellido." |
