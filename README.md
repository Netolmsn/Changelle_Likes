# Social Post Likes API - Desafio Backend

Esta é uma API robusta desenvolvida em **Node.js** que simula o sistema de curtidas de uma rede social. O foco principal do projeto é a **resiliência sob alta concorrência**, garantindo que o contador de likes permaneça íntegro mesmo com milhares de requisições simultâneas.


## Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **ORM:** [Prisma v6](https://www.prisma.io/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **Mensageria & Fila:** [Redis](https://redis.io/) + [BullMQ](https://docs.bullmq.io/)
* **Cache:** [Redis](https://redis.io/)
* **Documentação:** [Swagger/OpenAPI](https://swagger.io/)
* **Containerização:** [Docker](https://www.docker.com/)

---

## Diferenciais Técnicos

### 1. Consistência sob Concorrência (Fila)
Utilizamos o **BullMQ** para gerenciar uma fila de processamento de likes. Quando um usuário curte um post, a requisição é enfileirada no Redis e respondida imediatamente. O processamento real no banco de dados ocorre de forma assíncrona e ordenada, evitando *Race Conditions*.

### 2. Regra de Negócio: Like Único
Implementamos uma restrição de unicidade no banco de dados (`@@unique([userId, postId])`). Isso garante que um mesmo usuário não consiga curtir o mesmo post mais de uma vez, mesmo se enviar múltiplas requisições ao mesmo tempo.

### 3. Otimização de Leitura (Cache)
As rotas de **Listagem de Posts** e **Ranking** utilizam o Redis como camada de cache. Isso reduz drasticamente a carga no PostgreSQL e acelera o tempo de resposta para o usuário final.

### 4. Documentação Interativa
A API conta com o **Swagger UI**, permitindo testar todos os endpoints diretamente pelo navegador.

---

## Como Executar o Projeto

### 1. Subir a Infraestrutura (Docker)
```bash
docker-compose up -d
```

### 2. Instalar Dependências e Sincronizar Banco
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Rodar a Aplicação
```bash
npm run start:dev
```
A API estará disponível em: `http://localhost:3001`
A Documentação Swagger em: `http://localhost:3001/api`

---

## Teste de Estresse

O projeto inclui um script (`stress-test.js`) que simula **100 usuários diferentes** curtindo o mesmo post simultaneamente.

**Para rodar o teste:**
1. Crie um post via Swagger ou `curl`.
2. Insira o ID do post no arquivo `stress-test.js`.
3. Execute: `node stress-test.js`

**Resultado esperado:**
* **API:** 100% de sucesso no recebimento.
* **Worker:** 100 logs de processamento no terminal do NestJS.
* **Banco de Dados:** Exatamente 100 novos registros na tabela `Like`.

---

## Endpoints Principais

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/posts` | Cria um novo post |
| `GET` | `/posts` | Lista todos os posts (com cache) |
| `GET` | `/posts/ranking` | Lista os 10 posts mais curtidos (com cache) |
| `POST` | `/posts/:id/like` | Registra um like para um `userId` específico |

---

### Autor
**Leandro Mattos Santos Neto**
*Desenvolvedor de Software*
