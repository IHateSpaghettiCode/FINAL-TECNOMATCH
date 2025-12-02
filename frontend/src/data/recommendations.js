// src/data/recommendations.js // Archivo que contiene las recomendaciones de carreras por tipo MBTI

export const recommendations = { // Exporta el objeto de recomendaciones
  // 🔹 ANALISTAS (NT) // Sección para tipos analistas (Pensadores intuitivos)
  INTJ: [ // Recomendaciones para INTJ
    {
      id: 5, // ID único de la recomendación
      university: "Universidad Sergio Arboleda", // Nombre de la universidad
      program: "Ingeniería de Software", // Nombre del programa
      slug: "ingenieria-de-software", // Slug para URL
      description: // Descripción del programa
        "Formación práctica para desarrollar soluciones de software eficientes y escalables.",
      duration: "~120 horas", // Duración aproximada
      cards: [ // Array de tarjetas con información
        { label: "Modalidad", value: "Presencial (Bogotá)" }, // Modalidad
        { label: "Duración", value: "~120 horas" }, // Duración
        { label: "Inversión", value: "~$4.500.000 COP" }, // Costo
        {
          label: "Dirigido a", // Dirigido a
          value: "Ingeniería, Matemáticas, Ciencias de la Computación",
        },
      ],
      objective: // Objetivo del programa
        "Capacitar al estudiante en desarrollo de software aplicando buenas prácticas y metodologías ágiles.",
      image: // URL de la imagen
        "https://images.unsplash.com/photo-1581091215365-8d3f8c91289d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 6, // Segunda recomendación para INTJ
      university: "Universidad Nacional de Colombia",
      program: "Ciencia de Datos",
      slug: "ciencia-de-datos",
      description:
        "Formación avanzada en análisis de datos y ciencia de la información.",
      duration: "~150 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~150 horas" },
        { label: "Inversión", value: "~$3.900.000 COP" },
        { label: "Dirigido a", value: "Ingeniería de software y computación" },
      ],
      objective:
        "Preparar profesionales capaces de analizar datos y generar conocimiento útil para la toma de decisiones.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=60",
    },
  ],

  INTP: [ // Recomendaciones para INTP
    {
      id: 7,
      university: "Universidad Nacional de Colombia",
      program: "Investigación en IA",
      slug: "investigacion-en-ia",
      description:
        "Programa enfocado en inteligencia artificial, aprendizaje automático y prototipado de soluciones.",
      duration: "~160 horas",
      cards: [
        { label: "Modalidad", value: "Presencial y Virtual (Bogotá)" },
        { label: "Duración", value: "~160 horas" },
        { label: "Inversión", value: "~$3.800.000 COP" },
        { label: "Dirigido a", value: "Estadística, Matemáticas, Ingeniería" },
      ],
      objective:
        "Desarrollar habilidades para analizar datos y construir modelos de IA.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 8,
      university: "Universidad de los Andes",
      program: "Arquitectura de Software",
      slug: "arquitectura-de-software",
      description:
        "Estudios avanzados en diseño de sistemas distribuidos y escalables.",
      duration: "~140 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~140 horas" },
        { label: "Inversión", value: "~$4.000.000 COP" },
        { label: "Dirigido a", value: "Ingeniería, Matemáticas, Computación" },
      ],
      objective:
        "Formar arquitectos de software capaces de diseñar aplicaciones sostenibles.",
      image:
        "https://images.unsplash.com/photo-1505666287802-931dc83948e3?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ENTJ: [ // Recomendaciones para ENTJ
    {
      id: 9,
      university: "Universidad de los Andes",
      program: "Gestión de Proyectos TI",
      slug: "gestion-de-proyectos-ti",
      description:
        "Entrenamiento en liderazgo de proyectos tecnológicos con metodologías ágiles y PMI.",
      duration: "~120 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~120 horas" },
        { label: "Inversión", value: "~$5.000.000 COP" },
        {
          label: "Dirigido a",
          value: "Administradores, Ingenieros, Líderes de proyecto",
        },
      ],
      objective:
        "Formar profesionales capaces de gestionar proyectos TIC de alto impacto.",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131a6b0?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 10,
      university: "Universidad Javeriana",
      program: "Dirección de Producto (PM)",
      slug: "direccion-de-producto-pm",
      description:
        "Programa especializado en liderazgo y dirección estratégica de productos tecnológicos.",
      duration: "2 años",
      cards: [
        { label: "Modalidad", value: "Virtual y Presencial" },
        { label: "Duración", value: "2 años" },
        { label: "Inversión", value: "~$40.000.000 COP" },
        { label: "Dirigido a", value: "Líderes, gerentes y ejecutivos" },
      ],
      objective:
        "Preparar líderes capaces de dirigir la transformación digital en organizaciones.",
      image:
        "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ENTP: [ // Recomendaciones para ENTP
    {
      id: 11,
      university: "Universidad de los Andes",
      program: "Product Management",
      slug: "product-management",
      description:
        "Formación en gestión de productos, innovación y estrategia de mercado.",
      duration: "~120 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~120 horas" },
        { label: "Inversión", value: "~$4.500.000 COP" },
        { label: "Dirigido a", value: "Ingenieros, Creativos, Emprendedores" },
      ],
      objective:
        "Capacitar en desarrollo de productos y estrategias innovadoras.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 12,
      university: "Universidad Nacional de Colombia",
      program: "Innovación / Startups",
      slug: "innovacion-startups",
      description:
        "Programa orientado a la creación y gestión de startups tecnológicas.",
      duration: "~140 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~140 horas" },
        { label: "Inversión", value: "~$4.000.000 COP" },
        { label: "Dirigido a", value: "Emprendedores, Innovadores, Ingenieros" },
      ],
      objective:
        "Fomentar la capacidad de innovar y llevar ideas al mercado.",
      image:
        "https://images.unsplash.com/photo-1505666287802-931dc83948e3?auto=format&fit=crop&w=600&q=60",
    },
  ],

  INFJ: [ // Recomendaciones para INFJ
    {
      id: 13,
      university: "Universidad de los Andes",
      program: "UX Research",
      slug: "ux-research",
      description:
        "Formación en investigación de usuarios y experiencia de usuario.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.500.000 COP" },
        { label: "Dirigido a", value: "Diseñadores, Psicólogos, Creativos" },
      ],
      objective:
        "Capacitar en técnicas de investigación y análisis de experiencia de usuario.",
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 14,
      university: "Universidad Nacional de Colombia",
      program: "Ética de Datos",
      slug: "etica-de-datos",
      description:
        "Estudios en ética aplicada a manejo de datos y tecnologías de la información.",
      duration: "~90 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~90 horas" },
        { label: "Inversión", value: "~3.000.000 COP" },
        { label: "Dirigido a", value: "Ingenieros, Analistas, Investigadores" },
      ],
      objective:
        "Formar profesionales conscientes del impacto ético de los datos y tecnologías.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
  ],

  INFP: [ // Recomendaciones para INFP
    {
      id: 15,
      university: "Universidad Nacional de Colombia",
      program: "Redacción Técnica",
      slug: "redaccion-tecnica",
      description:
        "Formación en escritura y documentación técnica profesional.",
      duration: "~80 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~80 horas" },
        { label: "Inversión", value: "~2.500.000 COP" },
        { label: "Dirigido a", value: "Comunicadores, Ingenieros, Creativos" },
      ],
      objective:
        "Capacitar en creación de contenidos técnicos claros y efectivos.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 16,
      university: "Universidad Jorge Tadeo Lozano",
      program: "Diseño Multimedial",
      slug: "diseno-multimedial",
      description:
        "Programa orientado a la creación de contenidos visuales y multimedia.",
      duration: "~90 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~90 horas" },
        { label: "Inversión", value: "~3.000.000 COP" },
        { label: "Dirigido a", value: "Diseño, Comunicación, Arte digital" },
      ],
      objective:
        "Formar profesionales capaces de generar contenidos creativos y visuales.",
      image:
        "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ENFJ: [ // Recomendaciones para ENFJ
    {
      id: 17,
      university: "Universidad de los Andes",
      program: "EdTech (Formación Digital)",
      slug: "edtech-formacion-digital",
      description:
        "Formación en diseño y gestión de plataformas educativas digitales.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.500.000 COP" },
        { label: "Dirigido a", value: "Educadores, Comunicadores, Gestores" },
      ],
      objective:
        "Capacitar en desarrollo de experiencias educativas digitales efectivas.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 18,
      university: "Universidad Nacional de Colombia",
      program: "Gestión de Comunidad Tech",
      slug: "gestion-de-comunidad-tech",
      description:
        "Especialización en gestión de comunidades de tecnología y usuarios.",
      duration: "~90 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~90 horas" },
        { label: "Inversión", value: "~3.000.000 COP" },
        { label: "Dirigido a", value: "Community Managers, Marketing, TI" },
      ],
      objective:
        "Formar profesionales capaces de conectar personas y gestionar comunidades tecnológicas.",
      image:
        "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ENFP: [ // Recomendaciones para ENFP
    {
      id: 19,
      university: "Universidad de los Andes",
      program: "Marketing Digital",
      slug: "marketing-digital",
      description:
        "Formación en estrategias de marketing digital y comunicación online.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.500.000 COP" },
        { label: "Dirigido a", value: "Marketing, Comunicación, Creativos" },
      ],
      objective:
        "Capacitar en estrategias efectivas de marketing digital y comunicación.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 20,
      university: "Universidad Nacional de Colombia",
      program: "UX Writing",
      slug: "ux-writing",
      description:
        "Programa orientado a redacción de experiencias digitales centradas en el usuario.",
      duration: "~90 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~90 horas" },
        { label: "Inversión", value: "~3.000.000 COP" },
        { label: "Dirigido a", value: "Diseñadores, Comunicadores, UX" },
      ],
      objective:
        "Formar profesionales capaces de escribir contenido claro y centrado en usuarios.",
      image:
        "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&w=600&q=60",
    },
  ],

  // 🔹 GUARDIANES (SJ) // Sección para tipos guardianes (Sensores juiciosos)
  ISTJ: [ // Recomendaciones para ISTJ
    {
      id: 21,
      university: "Universidad Nacional de Colombia",
      program: "QA / Testing",
      slug: "qa-testing",
      description:
        "Formación en aseguramiento de calidad de software y pruebas automatizadas.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.200.000 COP" },
        { label: "Dirigido a", value: "Ingenieros, Analistas, Desarrolladores" },
      ],
      objective:
        "Capacitar en técnicas de pruebas de software y control de calidad.",
      image:
        "https://images.unsplash.com/photo-1581092338344-9eae48903f8f?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 22,
      university: "Universidad Javeriana",
      program: "Administración de Sistemas",
      slug: "administracion-de-sistemas",
      description:
        "Programa enfocado en administración y mantenimiento de sistemas y redes.",
      duration: "~120 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~120 horas" },
        { label: "Inversión", value: "~4.000.000 COP" },
        { label: "Dirigido a", value: "Ingenieros, Administradores TI" },
      ],
      objective:
        "Formar profesionales capaces de gestionar infraestructuras tecnológicas de manera eficiente.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ISFJ: [ // Recomendaciones para ISFJ
    {
      id: 23,
      university: "Universidad Externado",
      program: "Soporte TI",
      slug: "soporte-ti",
      description:
        "Formación en soporte técnico y atención al cliente en entornos tecnológicos.",
      duration: "~80 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~80 horas" },
        { label: "Inversión", value: "~2.800.000 COP" },
        { label: "Dirigido a", value: "Técnicos, Administrativos, Soporte" },
      ],
      objective:
        "Capacitar para brindar soporte eficiente y soluciones técnicas a usuarios.",
      image:
        "https://images.unsplash.com/photo-1531497865145-1e14bfb1b499?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 24,
      university: "Universidad de los Andes",
      program: "Documentación Técnica",
      slug: "documentacion-tecnica",
      description:
        "Especialización en redacción y gestión de documentación técnica y manuales.",
      duration: "~90 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~90 horas" },
        { label: "Inversión", value: "~3.000.000 COP"},
	      { label: "Dirigido a", value: "Comunicadores, Técnicos, Ingenieros" },
      ],
      objective:
        "Formar profesionales capaces de generar documentación clara y precisa.",
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ESTJ: [ // Recomendaciones para ESTJ
    {
      id: 25,
      university: "Universidad de los Andes",
      program: "IT Service Management",
      slug: "it-service-management",
      description:
        "Formación en gestión de servicios TI, procesos y buenas prácticas.",
      duration: "~120 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~120 horas" },
        { label: "Inversión", value: "~4.500.000 COP" },
        { label: "Dirigido a", value: "Administradores, Ingenieros, Líderes TI" },
      ],
      objective:
        "Capacitar en administración de servicios TI siguiendo estándares internacionales.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 26,
      university: "Politécnico Grancolombiano",
      program: "Operaciones TI",
      slug: "operaciones-ti",
      description:
        "Programa enfocado en supervisión y optimización de operaciones tecnológicas.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.800.000 COP" },
        { label: "Dirigido a", value: "Administradores TI, Ingenieros" },
      ],
      objective:
        "Formar profesionales capaces de gestionar operaciones de sistemas y redes eficientemente.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ESFJ: [ // Recomendaciones para ESFJ
    {
      id: 27,
      university: "Universidad Jorge Tadeo Lozano",
      program: "Customer Success (SaaS)",
      slug: "customer-success-saas",
      description:
        "Especialización en gestión de clientes y adopción de software SaaS.",
      duration: "~80 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~80 horas" },
        { label: "Inversión", value: "~2.800.000 COP" },
        { label: "Dirigido a", value: "Marketing, Soporte, Gestión de Clientes" },
      ],
      objective:
        "Capacitar para mejorar la experiencia del cliente y la adopción de productos digitales.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 28,
      university: "Universidad de los Andes",
      program: "Implementación de Software",
      slug: "implementacion-de-software",
      description:
        "Programa en gestión e implementación de soluciones de software corporativo.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.500.000 COP" },
        { label: "Dirigido a", value: "Ingenieros, Administradores, Consultores TI" },
      ],
      objective:
        "Formar profesionales capaces de implementar soluciones TI de manera eficiente.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=60",
    },
  ],

  // 🔹 ARTISTAS (SP) // Sección para tipos artistas (Sensores perceptivos)
  ISTP: [ // Recomendaciones para ISTP
    {
      id: 29,
      university: "Universidad Nacional de Colombia",
      program: "DevOps / SRE",
      slug: "devops-sre",
      description:
        "Formación en integración, despliegue y operación de software en producción.",
      duration: "~120 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~120 horas" },
        { label: "Inversión", value: "~4.000.000 COP" },
        { label: "Dirigido a", value: "Ingenieros de software, SysAdmin" },
      ],
      objective:
        "Capacitar en prácticas DevOps y confiabilidad de sistemas críticos.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 30,
      university: "Politécnico Grancolombiano",
      program: "Redes y Telecomunicaciones",
      slug: "redes-y-telecomunicaciones",
      description:
        "Especialización en diseño y administración de redes de comunicación.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.800.000 COP" },
        { label: "Dirigido a", value: "Ingenieros de redes, Telecom" },
      ],
      objective:
        "Formar profesionales capaces de gestionar infraestructura de redes eficientemente.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ISFP: [ // Recomendaciones para ISFP
    {
      id: 31,
      university: "Universidad Jorge Tadeo Lozano",
      program: "Diseño UI",
      slug: "diseno-ui",
      description:
        "Formación en diseño de interfaces y experiencia de usuario visualmente atractivas.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.000.000 COP" },
        { label: "Dirigido a", value: "Diseñadores, Creativos, UX" },
      ],
      objective:
        "Capacitar en diseño de interfaces atractivas y funcionales.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 32,
      university: "Politécnico Grancolombiano",
      program: "Animación / Motion",
      slug: "animacion-motion",
      description:
        "Programa orientado al diseño animado e interactivo en entornos digitales.",
      duration: "~90 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~90 horas" },
        { label: "Inversión", value: "~2.800.000 COP" },
        { label: "Dirigido a", value: "Diseño, Comunicación, Creatividad digital" },
      ],
      objective:
        "Formar profesionales capaces de generar experiencias visuales dinámicas.",
      image:
        "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ESTP: [ // Recomendaciones para ESTP
    {
      id: 33,
      university: "Universidad Central",
      program: "Ventas Técnicas",
      slug: "ventas-tecnicas",
      description:
        "Formación en estrategias de ventas de productos tecnológicos y servicios.",
      duration: "~80 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~80 horas" },
        { label: "Inversión", value: "~2.500.000 COP" },
        { label: "Dirigido a", value: "Ventas, Marketing, Ingenieros" },
      ],
      objective:
        "Capacitar en técnicas de ventas efectivas para productos tecnológicos.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 34,
      university: "Universidad de los Andes",
      program: "Ciberseguridad Ofensiva",
      slug: "ciberseguridad-ofensiva",
      description:
        "Especialización en técnicas de seguridad informática y pruebas de penetración.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.800.000 COP" },
        { label: "Dirigido a", value: "Seguridad, TIC, Ingenieros" },
      ],
      objective:
        "Formar profesionales capaces de identificar vulnerabilidades y proteger sistemas.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=60",
    },
  ],

  ESFP: [ // Recomendaciones para ESFP
    {
      id: 35,
      university: "Universidad Jorge Tadeo Lozano",
      program: "Community Manager",
      slug: "community-manager",
      description:
        "Formación en gestión de comunidades online y redes sociales.",
      duration: "~80 horas",
      cards: [
        { label: "Modalidad", value: "Virtual" },
        { label: "Duración", value: "~80 horas" },
        { label: "Inversión", value: "~2.500.000 COP" },
        { label: "Dirigido a", value: "Marketing, Comunicación, Social Media" },
      ],
      objective:
        "Capacitar para gestionar comunidades digitales de manera efectiva.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 36,
      university: "Politécnico Grancolombiano",
      program: "Event Tech",
      slug: "event-tech",
      description:
        "Especialización en tecnología para la organización y gestión de eventos.",
      duration: "~100 horas",
      cards: [
        { label: "Modalidad", value: "Presencial (Bogotá)" },
        { label: "Duración", value: "~100 horas" },
        { label: "Inversión", value: "~3.500.000 COP" },
        { label: "Dirigido a", value: "Eventos, Marketing, Tecnología" },
      ],
      objective:
        "Formar profesionales capaces de implementar soluciones tecnológicas para eventos.",
      image:
        "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=60",
    },
  ],
};
