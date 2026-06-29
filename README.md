### Estructura de Objetos y Flujo del Sistema

#### 1. Módulo de Usuario (Autenticación)

* **Objeto `User**`:
* `uid`: ID único de Firebase.
* `email`: Correo electrónico.
* `isGuest`: Booleano (para diferenciar usuarios logueados de los que usan *Local Storage*).

#### 2. Módulo de Vídeo

* **Objeto `Video**`:
* `id`: Identificador único (ej. ID de YouTube).
* `title`: Nombre del vídeo.
* `url`: URL fuente.
* `metadata`: Duración, autor.
* **Acciones**:
* `searchVideo(query)`: Búsqueda en base de datos.
* `playVideo()`: Renderizado en componente `iframe`.
* `editVideo()`: Modificar metadatos (solo si el usuario tiene permisos).

#### 3. Módulo de Playlist

* **Objeto `Playlist**`:
* `id`: ID único.
* `name`: Nombre de la lista.
* `videos`: Array de objetos `Video`.
* **Acciones**:
* `createPlaylist()`: Crear nueva lista.
* `listPlaylists()`: Mostrar todas las listas del usuario.
* `editPlaylist()`: Agregar/remover vídeos de la lista o cambiar nombre.
* `playFromPlaylist()`: Reproducir un vídeo específico dentro del `iframe` usando el contexto de la lista.

---

### Diagrama Lógico de Flujo

* Acceder a la web mediante el lugueo de firebase:  

    * Buscar vídeo (nombre) ✓
      # Reproducir vídeo (iframe) 

    * Buscar playlist (nombre) 
      * Editar playlist.
      * Listar playlist
        # Reproducir vídeo (iframe)

* Solo permite una muy escasa limitación de las opciones anteriores pero con local storage.


### Funciones que se repiten: 

* Reproducir vídeo (iframe) 
  * Editar vídeo.

