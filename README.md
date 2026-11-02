# NaruSurvivor

**[Jugar en GitHub Pages](https://bastian-alvarez.github.io/NaruSurvivor/)** · [Estado de publicación](https://github.com/bastian-alvarez/NaruSurvivor/actions/workflows/pages.yml)

Juego de supervivencia para navegador, con un servidor **Node.js** sin dependencias y renderizado Canvas 2D. Interfaz y controles en español. Proyecto fan no oficial inspirado en Naruto y en el ciclo de juego de Vampire Survivors.

El combate usa un renderizado pixelado de baja resolución con escalado nítido, conservando los sprites y animaciones originales del juego.

## Ejecutar

Requiere Node.js 20 o superior. Abre una terminal dentro de esta carpeta:

```powershell
npm start
```

Abre http://localhost:3000. No hace falta instalar paquetes. Puedes cambiar el puerto con la variable `PORT`. El servidor local escucha en `127.0.0.1`.

## Compartir y publicar

La versión pública está alojada en GitHub Pages y no requiere iniciar sesión. Todo el juego se ejecuta en el navegador; Node.js se usa para desarrollo, pruebas y generación de los archivos estáticos.

Cada push a `main` ejecuta las pruebas y publica `dist/` mediante GitHub Actions. Los pull requests solo ejecutan pruebas y build. El repositorio debe tener **Settings → Pages → Source: GitHub Actions**.

Las rutas de recursos son relativas para funcionar tanto en `localhost` como bajo `/NaruSurvivor/`. El historial y los ajustes de cada amigo se guardan en su propio navegador. No hay multijugador ni servidor de partidas compartidas.

```powershell
npm test
npm run build
```

El build genera `dist/`, listo para alojamiento estático. Node sirve el juego en desarrollo; el combate ocurre en el navegador y no necesita backend ni cuentas.

## Jugar

- Elige Naruto, Sasuke, Sakura, Hinata, Shikamaru o Itachi y el rango Genin, Chūnin o Jōnin.
- Muévete con WASD o flechas; Espacio activa un impulso con 3,5 segundos de recarga. Escape pausa. En móvil usa el joystick y el botón de impulso.
- Tus técnicas atacan automáticamente. Recoge fragmentos de chakra y elige una mejora al subir de nivel.
- Los pergaminos enseñan una de las cuatro técnicas propias del personaje. Puedes llevar **tres**; el siguiente pergamino permite reemplazar una o conservar el equipo.
- Corazones del bosque restauran hasta 35 PV; las alas shinobi aumentan la velocidad durante 8 segundos.
- Sobrevive al menos **9 minutos** y derrota a Shukaku, Gyūki y Kurama. Aparecen a los 2:30, 5:30 y 8:00; un jefe nuevo espera a que derrotes al anterior. El reloj continúa después de nueve minutos si todavía queda algún bijū.
- Rocas, árboles y lagunas bloquean el movimiento. Los círculos rojos señalan ataques de jefe; el minimapa muestra pergaminos, suministros y bijū.
- Efectos de sonido opcionales, reducción de movimiento y últimas 20 partidas guardadas en localStorage.

## Estructura

- `server.mjs`: servidor HTTP Node con rutas limitadas a archivos públicos.
- `public/data.js`: shinobis, técnicas, dificultades y retratos SVG originales.
- `public/engine.js`: simulación, colisiones, enemigos, progresión y renderizado.
- `public/balance.js`: reglas centralizadas de dificultad, experiencia y oleadas.
- `public/art.js`: sprites animados originales, bijū, terreno y vegetación; fotogramas y suelo precalculados.
- `public/portraits.js`: retratos SVG originales de los seis shinobis.
- `public/app.js`: interfaz, controles, sonido y guardado local.
- `public/assets/konoha.png`: ilustración ambiental generada para este proyecto.
- `tests/game.test.mjs`: verificaciones del combate, inventario, colisiones y victoria.

## Referencias de diseño

- [Vampire Survivors: subida de nivel](https://vampire.survivors.wiki/w/Level_up): experiencia recogida del suelo, pausa y elección de mejoras.
- [Vampire Survivors: armas](https://vampire.survivors.wiki/w/Weapon): ataques automáticos y progresión de técnicas.
- [Naruto Official](https://naruto-official.com/en): universo y personajes.
- [Naruto Official: Sakura](https://naruto-official.com/en/news/01_1743): fuerza y ninjutsu médico.

Los patrones, estadísticas, progresión y encuentros son adaptaciones propias para este prototipo. Los sprites y retratos están dibujados en código; no se incluyen capturas ni recursos extraídos de juegos comerciales.

## Actualización 1.1

- En Chūnin, ninjas: 30 → 55 PV y 11 → 18 de daño; perros: 22 → 38 PV y 8 → 14 de daño; ANBU: 65 → 120 PV y 11 → 25 de daño. La vida aumenta con el tiempo y los rangos aplican sus multiplicadores.
- Aumenta la velocidad de persecución. Las oleadas comienzan pequeñas y crecen cada 30 segundos. Los perros aparecen después de 15 segundos; los ANBU, después de 45.
- Los ANBU avisan durante 0,65 segundos antes de lanzar un kunai. Los obstáculos bloquean los proyectiles enemigos.
- Experiencia: enemigos básicos 3 → 1; ANBU 5 → 2; jefes 160 → 30. Primera mejora 12 → 18 puntos, con un coste mayor en niveles posteriores.
- Los proyectiles tienen penetración limitada: dos enemigos para técnicas dirigidas y uno para ráfagas, aumentando en niveles 4 y 7.
- Menos curaciones y pergaminos; regeneración de Sakura reducida de 1,5 a 0,6 PV/s. Derrotar un jefe cura 25 PV.
- Nuevos retratos, animaciones de carrera, peinados y vestuario distintos; máscaras ANBU, bandidos enmascarados y perros con pañuelo. Bijū con nuevos contornos y detalles propios.
- Terreno texturizado y senderos, dos tipos de árboles, rocas con musgo, estanques irregulares, flores, torii, faroles y un pequeño santuario. Las copas cercanas se vuelven transparentes.
- Las partidas guardan la versión de balance para distinguirlas del historial anterior.

Para un informe reproducible de supervivencia con Naruto en Chūnin y tres semillas:

```powershell
node scripts/balance-report.mjs
```

Los controles automáticos quieto, circular y evasivo sirven como comparación aproximada, no como prueba de que la dificultad esté equilibrada para todos los jugadores.
