# BTG Invest - Plataforma de Inversiones

Esta aplicación es una plataforma de gestión de inversiones diseñada para permitir a los usuarios explorar fondos de inversión (FIC y FPV), realizar suscripciones con métodos de notificación personalizados y gestionar su historial de transacciones.

## 🚀 Tecnologías Utilizadas

- **Core**: Angular 21 (Signals para gestión de estado reactivo).
- **UI Components**: PrimeNG (Table, Toast, InputText, etc.).
- **Styling**: PrimeFlex & SCSS (Diseño responsivo y moderno con Glassmorphism).
- **Backend Mock**: `json-server` para persistencia de datos localmente.
- **Testing**: Vitest para pruebas unitarias rápidas y modernas.
- **Icons**: PrimeIcons.

## 🛠️ Requisitos Previos

- **Node.js**: Versión 18 o superior recomendada (uso de nvm )
- **NPM**: Incluido con Node.js.

## 📋 Comandos de Ejecución

### 1. Instalación de Dependencias
```bash
npm install
```

### 2. Ejecución del Servidor Mock (Backend)
Es **indispensable** correr primero el servidor de datos para que la aplicación funcione correctamente. Por defecto corre en el puerto `3000`.
```bash
npm run mock
```

### 3. Ejecución de la Aplicación (Frontend)
Abre [http://localhost:4200](http://localhost:4200) para ver la aplicación en el navegador.
```bash
npm start
```

### 4. Ejecución de Pruebas Unitarias
Para correr la suite de pruebas con Vitest:
```bash
npm test
```

## 🔑 Características Principales

- **Filtro dinámico**: Filtrado reactivo por tipo de fondo (FIC/FPV) en el catálogo.
- **Suscripciones**: Integración con flujo de validación de saldo y monto mínimo.
- **Notificaciones**: Selección de canal (Email/SMS) integrado en el envío.
- **Historial**: Seguimiento detallado de suscripciones activas y cancelaciones pasadas.
- **Loader Global**: Interceptor HTTP para mostrar estado de carga en todas las peticiones.

## 📁 Estructura del Proyecto

- `src/app/pages`: Componentes principales de vista (Founds, Historial).
- `src/app/components`: Componentes reutilizables (Card, Navbar, Sidebar).
- `src/app/services`: Lógica de comunicación con la API (Mock).
- `src/app/models`: Interfaces de TypeScript para contratos de datos.
- `src/app/data`: Archivos de configuración y textos (Diccionario local).
