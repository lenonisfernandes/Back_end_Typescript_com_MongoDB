# Procedimento para iniciar

Para visualizar melhor este arquivo aperte ctrl + shit + v

## Dependências para este projeto

As seguintes versões foram utilizadas neste projeto:

- node@22.4.0
- npm@10.8.1

## Instalação inicial do projeto

1. Inicialize o projeto de node.js executando o comando abaixo no terminal:

```bash
npm init # inicia o projeto de node
```

2. Responda os itens da forma que desejar. Ps. Você poderá alterá-lo depois.

Na opção "entry point:", recomendo colocar o "src/index.ts".

Será criado uma arquivo package.json na raiz do seu diretório. Exemplo do resultado:
```json
{
  "name": "tsbackend",
  "version": "0.0.1",
  "description": "Código das aulas de typescript back do instituto Infnet",
  "main": "src/index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Renan Torres",
  "license": "ISC"
}
```

4. Instale as dependências necessárias ao typescript executando o comando abaixo no terminal:

```bash
npm i typescript @types/node ts-node --save-dev 
# instala deps do ts como deps de dev
```

5. Crie uma pasta "src" para separar o código da aplicação das configurações externar:

```bash
mkdir src  # cria o diretorio fonte
```

6. Inicie o typescript com o comando abaixo:

```bash
npx tsc --init # inicializa o typescript
```

Agora você terá um arquivo tsconfig.json na pasta raíz do seu projeto

7. Para utilizar o hot reload instale o ts-node-dev

```bash
npm install --save-dev ts-node-dev
```

```json
"scripts": {
  "dev": "ts-node-dev src/main.ts"
}
```


## Configurações

### No arquivo tsconfig.json (se encontra na raíz do projeto)

1. Descomente a linha '"rootDir": "./",' (remova os '//' antes da linha) ;

2. Altere o  '"rootDir": "./",' para  '"rootDir": "./src",'.

3. Descomente  "outDir": "./", e altere para   "outDir": "./dist",

Resultado final:

```json
{
  "compilerOptions": {
    "target": "es2020", 
    "module": "commonjs",   
    "rootDir": "./src",
    "sourceMap": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true 
  }
} 
```

### No arquivo package.json

1. Dentro das chaves de scripts adicionar a linha start:

```ts
  "scripts": {
    "start": "ts-node src/index.ts",
    // demais scripts que desejar...
    "build": "npx tsc"
  },
```

### Debugger

1. Rode o script de build para criar os arquivos de produção (o debugger precisa dele para rodar):

```bash
npm run build
```

ou:

```bash
npx tsc
```

2. Na pasta raíz, criar arquivo ".vscode/launch.json"

3. Copie e cole a configuração abaixo dentro do arquivo:

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug TS",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/index.ts",
            "runtimeArgs": ["-r", "ts-node/register"],
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ]
        },
    ]
}
```

4. Variável de ambiente

```bash
node --env-file=.env index.js
```
```env
NODE_OPTIONS='--title="Testing Node v20.6.0"'
USER_NAME='Renan Torres'
```

5. Opcional Lint

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init
```

(Atualizado 2025) Respostas que usei na Configuração ao usar o npx eslint --init
```bash
npx eslint --init
You can also run this command directly using 'npm init @eslint/config@latest'.

> tsbackend@1.0.0 npx
> create-config

@eslint/create-config: v1.10.0

√ What do you want to lint? · javascript, json, jsonc, md
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · node
√ Which language do you want your configuration file be written in? · ts
√ What flavor of Markdown do you want to lint? · gfm
Jiti is required for Node.js <24.3.0 to read TypeScript configuration files.
√ Would you like to add Jiti as a devDependency? · No / Yes
The config that you've selected requires the following dependencies:
```

(Atualizado 2025) Criar, ou modificar, o arquivo de configuração .eslintrc.mts: 

```ts
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';

const tsConfig = tseslint.config(
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'quotes': ['error', 'single'], // força aspas simples
      'semi': ['error', 'always'],   // força ponto e vírgula
    },
  }
);

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: globals.node } },
  tsConfig,
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  { files: ['**/*.jsonc'], plugins: { json }, language: 'json/jsonc', extends: ['json/recommended'] },
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] },
]);
```

versão sem erro de tipo
```ts
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

const tsConfig: FlatConfig.Config[] = [
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  }
];

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
    },
  },
  ...tsConfig,
  {
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
    plugins: { json },
  },
  {
    files: ['**/*.jsonc'],
    language: 'json/jsonc',
    ...json.configs.recommended,
    plugins: { json },
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    ...markdown.configs.recommended,
  },
];
```

Adiciona um script para o lint no package.json:
```json
{
    "scripts": {
        //... demais scripts...
        "lint": "eslint ./src/**/*.ts --fix"
    }
}
```

Adicionar o eslint no settings.json do vscode (Aperte 'ctrl + alt + p' e busque por settings.json e escolha a opção default ) 

```json
{
    "workbench.iconTheme": "vscode-icons",
    // Configurações do ESLint
    "eslint.validate": [
        "javascript",
        "typescript"
    ],
    // Actions no save
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    // Configurações gerais do editor
    "editor.formatOnSave": true,
}
```



