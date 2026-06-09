-- Se ejecuta automáticamente la primera vez que se crea el contenedor de PostgreSQL
-- (ver docker-entrypoint-initdb.d en docker-compose.yml)

CREATE TABLE IF NOT EXISTS productos (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    price    NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    size     TEXT[] NOT NULL DEFAULT '{}',
    stock    INTEGER NOT NULL DEFAULT 0,
    image    VARCHAR(100)
);

INSERT INTO productos (id, name, price, category, size, stock, image) VALUES
(1, 'Remera', 77, 'Superior', ARRAY['S','M','L'], 19, 'remera'),
(2, 'Pantalon', 47, 'Inferior', ARRAY['S','M','L'], 6, 'pantalon'),
(3, 'Pantalon', 47, 'Inferior', ARRAY['S','M','L'], 6, 'pantalon'),
(4, 'Pantalon', 47, 'Inferior', ARRAY['S','M','L'], 6, 'pantalon'),
(5, 'Remera', 77, 'Superior', ARRAY['S','M','L'], 19, 'remera'),
(6, 'Remera', 77, 'Superior', ARRAY['S','M','L'], 19, 'remera'),
(8, 'Remera', 77, 'Superior', ARRAY['S','M','L'], 19, 'remera'),
(7, 'Remera', 77, 'Superior', ARRAY['S','M','L'], 19, 'remera'),
(9, 'Buzo', 77, 'Superior', ARRAY['S','M','L'], 19, 'buzo'),
(10, 'Buzo', 77, 'Superior', ARRAY['S','M','L'], 19, 'buzo'),
(11, 'Buzo', 77, 'Superior', ARRAY['S','M','L'], 19, 'buzo'),
(12, 'Short', 77, 'Inferior', ARRAY['S','M','L'], 19, 'short'),
(13, 'Short', 77, 'Inferior', ARRAY['S','M','L'], 19, 'short'),
(14, 'Short', 77, 'Inferior', ARRAY['S','M','L'], 19, 'short'),
(15, 'Short', 77, 'Inferior', ARRAY['S','M','L'], 19, 'short'),
(16, 'Camisa', 77, 'Superior', ARRAY['S','M','L'], 19, 'camisa'),
(17, 'Camisa', 77, 'Superior', ARRAY['S','M','L'], 19, 'camisa'),
(18, 'Camisa', 77, 'Superior', ARRAY['S','M','L'], 19, 'camisa'),
(19, 'Camisa', 77, 'Superior', ARRAY['S','M','L'], 19, 'camisa'),
(20, 'Campera', 77, 'Superior', ARRAY['S','M','L'], 19, 'campera'),
(21, 'Campera', 77, 'Superior', ARRAY['S','M','L'], 19, 'campera'),
(22, 'Campera', 77, 'Superior', ARRAY['S','M','L'], 19, 'campera');

-- Como insertamos los IDs a mano, hay que adelantar la secuencia
-- para que el próximo INSERT (sin id) continúe desde 23
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
