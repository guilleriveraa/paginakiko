<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Intentar obtener desde localStorage o archivo local
$filePath = __DIR__ . '/../data/textos.json';

if (file_exists($filePath)) {
    $content = file_get_contents($filePath);
    if ($content) {
        echo $content;
        exit;
    }
}

// Si no hay archivo, devolver datos por defecto
$defaultData = [
    "header" => [
        "logo_texto" => "Cerrajeria y Aluminio Francisco Rivera",
        "logo_sub" => "e Hijo"
    ],
    "nav" => [
        "inicio" => "Inicio",
        "servicios" => "Servicios",
        "productos" => "Productos",
        "galeria" => "Galería",
        "contacto" => "Contacto",
        "presupuesto" => "Presupuesto"
    ],
    "index" => [
        "hero_titulo" => "Cerrajería Francisco Rivera e Hijo",
        "hero_descripcion" => "Más de 30 años de experiencia en el sector",
        "btn_presupuesto" => "Solicitar presupuesto",
        "btn_productos" => "Ver productos",
        "seccion_titulo" => "Nuestra esencia",
        "seccion_subtitulo" => "Más de 30 años de tradición y calidad",
        "valor1_titulo" => "Experiencia",
        "valor1_desc" => "Tres décadas de trabajo en el sector de la cerrajería y la metalurgia.",
        "valor2_titulo" => "Calidad",
        "valor2_desc" => "Utilizamos los mejores materiales y procesos para garantizar productos duraderos.",
        "valor3_titulo" => "Confianza",
        "valor3_desc" => "Fabricamos para clientes de toda la provincia, ofreciendo un trato cercano."
    ],
    "servicios" => [
        "titulo" => "Servicios de cerrajería y fabricación",
        "descripcion" => "Más de 30 años de experiencia ofreciendo soluciones metálicas de calidad",
        "cerrajeria_titulo" => "Cerrajería en general",
        "cerrajeria_desc" => "Instalación y reparación de puertas metálicas, cerraduras, rejas, barandillas y estructuras metálicas.",
        "herramientas_titulo" => "Herramientas agrícolas",
        "herramientas_desc" => "Fabricamos herramientas manuales de alta calidad para el sector agrícola.",
        "medida_titulo" => "Trabajos a medida",
        "medida_desc" => "Diseñamos y fabricamos piezas y estructuras metálicas personalizadas.",
        "proceso_titulo" => "¿Cómo trabajamos?",
        "proceso_desc" => "Un proceso sencillo y transparente",
        "paso1" => "Cuéntanos tu idea",
        "paso1_desc" => "Nos reunimos para conocer tus necesidades y requerimientos.",
        "paso2" => "Diseñamos la solución",
        "paso2_desc" => "Te preparamos un presupuesto detallado sin compromiso.",
        "paso3" => "Fabricación",
        "paso3_desc" => "Realizamos el trabajo con los mejores materiales y procesos.",
        "paso4" => "Instalación y entrega",
        "paso4_desc" => "Instalamos o entregamos el producto final con total garantía."
    ],
    "productos" => [
        "titulo" => "Productos de cerrajería y metalistería",
        "descripcion" => "Fabricación propia de productos metálicos con la máxima calidad",
        "cerrajeria_titulo" => "Cerrajería",
        "cerrajeria_desc" => "Puertas metálicas, rejas, cerraduras y forja artesanal.",
        "aluminio_titulo" => "Aluminio",
        "aluminio_desc" => "Ventanas, puertas y estructuras de aluminio.",
        "muebles_titulo" => "Muebles de Hierro",
        "muebles_desc" => "Mesas, sillas, estanterías y mobiliario a medida.",
        "barandillas_titulo" => "Barandillas",
        "barandillas_desc" => "Barandillas, pasamanos y protecciones para escaleras.",
        "motorizadas_titulo" => "Puertas Motorizadas",
        "motorizadas_desc" => "Puertas automáticas para garajes y naves industriales.",
        "varios_titulo" => "Varios",
        "varios_desc" => "Estructuras especiales, reparaciones y proyectos personalizados."
    ],
    "galeria" => [
        "titulo" => "Galería de imágenes",
        "descripcion" => "Explora nuestros trabajos de cerrajería, aluminio, muebles de hierro, barandillas y más.",
        "cerrajeria" => "Cerrajería",
        "cerrajeria_desc" => "Puertas, rejas, cerraduras y trabajos de forja",
        "aluminio" => "Aluminio",
        "aluminio_desc" => "Ventanas, puertas y estructuras de aluminio",
        "muebles" => "Muebles de Hierro",
        "muebles_desc" => "Mesas, sillas, estanterías y mobiliario",
        "barandillas" => "Barandillas",
        "barandillas_desc" => "Barandillas, pasamanos y protecciones",
        "varios" => "Varios",
        "varios_desc" => "Estructuras especiales y piezas únicas"
    ],
    "contacto" => [
        "titulo" => "¿Necesitas un presupuesto?",
        "descripcion" => "Cuéntanos lo que necesitas y te asesoraremos sin compromiso.",
        "telefono" => "653 67 66 71",
        "email" => "fco.riveraehijo@hotmail.com",
        "direccion" => "Polígono Industrial, C. Cobalto, 61",
        "ciudad" => "10810 Montehermoso, Cáceres",
        "formulario_titulo" => "Envíanos un mensaje"
    ],
    "footer" => [
        "texto" => "Cerrajería y Aluminio Francisco Rivera",
        "aviso_legal" => "Aviso legal",
        "cookies" => "Política de cookies"
    ]
];

echo json_encode($defaultData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);