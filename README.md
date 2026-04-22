Sistema de Likes Assíncrono de Alta Performance
Um serviço de backend escalável construído com NestJS, Prisma e BullMQ. Este projeto demonstra como lidar com cenários de alta concorrência como um post viral recebendo milhares de curtidas simultâneas utilizando uma arquitetura de mensageria para garantir a consistência dos dados, a resiliência do sistema e a unicidade de votos por usuário.

Stack Tecnológica
Framework: NestJS (TypeScript)

ORM: Prisma v6

Banco de Dados: PostgreSQL

Mensageria & Cache: Redis

Gerenciamento de Filas: BullMQ

Documentação: Swagger (OpenAPI)

Conteinerização: Docker

Visão Geral da Arquitetura
Em vez de realizar atualizações diretas no banco de dados — o que pode levar a Race Conditions e gargalos de conexão este sistema utiliza o padrão Produtor-Consumidor:

Produtor (API): Quando um usuário curte um post, a requisição é validada e enviada para uma fila no Redis. O usuário recebe um 201 Created em milissegundos.

Fila (BullMQ): Atua como um buffer, garantindo que nenhum dado seja perdido mesmo sob carga pesada.

Consumidor (Worker): Um trabalhador assíncrono consome as tarefas e realiza o registro do like e o incremento atômico no PostgreSQL. A lógica de negócio garante que um usuário não possa curtir o mesmo post duas vezes.

Cache de Leitura: As rotas de listagem e ranking utilizam Redis para evitar consultas repetitivas ao banco de dados.

Como Rodar o Projeto
1. Pré-requisitos
Node.js (v18+)

Docker & Docker Compose

2. Configuração do Ambiente
Crie um arquivo .env na raiz do projeto:
DATABASE_URL="postgresql://admin:2105@localhost:5433/likes_db?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379

3. Infraestrutura (Docker)
Suba o banco de dados e o Redis:
docker-compose up -d

4. Instalação e Migrations
npm install
npx prisma generate
npx prisma migrate dev --name init

5. Iniciando a Aplicação
npm run start:dev

Acesse a documentação Swagger em: http://localhost:3001/api

Teste de Estresse
Para demonstrar a capacidade do sistema, incluí um script de teste que simula 100 requisições simultâneas de usuários diferentes para um único post.

  1. Crie um post (via Swagger ou Prisma Studio) para obter um POST_ID válido.

  2. Atualize a variável POST_ID no arquivo stress-test.js.

  3. Execute o teste:
  npm run ode stress-test.js

Resultado Esperado:
Taxa de Sucesso da API: 100%

Consistência do Banco: O likesCount será exatamente 100, com 100 registros únicos na tabela de Likes. Se o teste for repetido com os mesmos usuários, o contador permanecerá em 100.

Por que esta arquitetura?
Escalabilidade: A API permanece responsiva pois delega operações pesadas para o background.

Integridade dos Dados: O uso de restrições de unicidade (@@unique) e filas impede duplicidade e perda de atualizações.

Tolerância a Falhas: Se o banco cair, os likes ficam seguros no Redis e são processados assim que o banco retornar.

Performance de Leitura: O uso de cache no ranking e listagem garante respostas em milissegundos para os endpoints mais acessados.

