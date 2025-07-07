# Tech Challenge - Blog API

Este projeto é a implementação de um back-end para uma plataforma de blogging, desenvolvido como parte do Tech Challenge da Pós-Graduação em Full Stack Development.

## Tecnologias Utilizadas

* **Node.js**
* **Nest.JS** (Framework sobre o Node.js)
* **TypeScript**
* **MongoDB** (Banco de Dados NoSQL)
* **Mongoose** (ODM para interação com o MongoDB)
* **Docker** (Containerização da aplicação e do banco de dados)
* **Swagger (OpenAPI)** (Documentação interativa da API)

## Como Rodar o Projeto

1.  **Pré-requisitos:** É necessário ter o `Docker` e o `Docker Compose` instalados em sua máquina.
2.  **Clone o Repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-da-pasta-do-projeto>
    ```
3.  **Inicie o Ambiente:** Na raiz do projeto, execute o seguinte comando para construir a imagem e iniciar os containers:
    ```bash
    docker compose up --build
    ```
4.  **Acesso:** A API estará disponível em `http://localhost:3000`.

## Guia da API

A documentação completa e interativa da API está disponível via Swagger. É a forma recomendada para testar os endpoints.

* **URL da Documentação Interativa:** **[http://localhost:3000/api](http://localhost:3000/api)**

Abaixo está um guia detalhado de cada endpoint disponível.

---

### **1. Criar um Novo Post**

* **Endpoint:** `POST /posts`
* **Descrição:** Cria uma nova postagem no blog.
* **Corpo da Requisição (`Request Body`):**
    ```json
    {
      "title": "Título da Postagem",
      "content": "Conteúdo detalhado da postagem.",
      "author": "Nome do Autor"
    }
    ```
* **Resposta de Sucesso (`201 Created`):** Retorna o objeto do post recém-criado, incluindo o `_id` e os timestamps gerados pelo banco de dados.
    ```json
    {
      "title": "Título da Postagem",
      "content": "Conteúdo detalhado da postagem.",
      "author": "Nome do Autor",
      "_id": "686b36568b8280a922b9b126",
      "createdAt": "2025-07-07T03:00:00.000Z",
      "updatedAt": "2025-07-07T03:00:00.000Z",
      "__v": 0
    }
    ```

---

### **2. Listar Todos os Posts**

* **Endpoint:** `GET /posts`
* **Descrição:** Retorna uma lista com todas as postagens existentes no banco de dados.
* **Resposta de Sucesso (`200 OK`):** Retorna um array de objetos de post.
    ```json
    [
      {
        "_id": "686b36568b8280a922b9b126",
        "title": "Título da Postagem 1",
        "content": "Conteúdo da postagem 1.",
        "author": "Autor 1"
      },
      {
        "_id": "7a7c47679c9391b033c0c237",
        "title": "Título da Postagem 2",
        "content": "Conteúdo da postagem 2.",
        "author": "Autor 2"
      }
    ]
    ```

---

### **3. Buscar um Post Específico**

* **Endpoint:** `GET /posts/{id}`
* **Descrição:** Retorna uma postagem específica com base no seu `_id` único.
* **Parâmetros da URL:**
    * `id` (string): O ID do post a ser buscado.
* **Resposta de Sucesso (`200 OK`):** Retorna o objeto do post encontrado.
* **Resposta de Erro (`404 Not Found`):** Retornada se nenhum post for encontrado com o ID fornecido.

---

### **4. Atualizar um Post**

* **Endpoint:** `PATCH /posts/{id}`
* **Descrição:** Atualiza uma ou mais informações de uma postagem existente.
* **Parâmetros da URL:**
    * `id` (string): O ID do post a ser atualizado.
* **Corpo da Requisição (`Request Body`):** Envie apenas os campos que deseja alterar.
    ```json
    {
      "content": "Este é um novo conteúdo atualizado para a postagem."
    }
    ```
* **Resposta de Sucesso (`200 OK`):** Retorna o objeto completo do post **após** a atualização.
* **Resposta de Erro (`404 Not Found`):** Retornada se o post a ser atualizado não for encontrado.

---

### **5. Excluir um Post**

* **Endpoint:** `DELETE /posts/{id}`
* **Descrição:** Remove permanentemente uma postagem do banco de dados.
* **Parâmetros da URL:**
    * `id` (string): O ID do post a ser excluído.
* **Resposta de Sucesso (`200 OK`):** Retorna o objeto do post que acabou de ser removido.
* **Resposta