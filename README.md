<p align="center">
  <a href="https://github.com/flowritecom/llm-lab-oss">
   <img src="https://github.com/flowritecom/llm-lab-oss/assets/34722968/7cac48e2-9c72-442b-b7c5-b6a0546beb6d" alt="Logo">
  </a>
  
  <p align="center">
    The experimentation lab to merge language models with ease.
    <br />
    <a href="https://github.com/flowritecom/llm-lab-oss#-getting-started">Getting Started</a>
    -
    <a href="https://github.com/flowritecom/llm-lab-oss/blob/main/CONTRIBUTING.md/">Contributing</a>
    -
    <a href="https://github.com/flowritecom/llm-lab-oss/issues">Issues</a>
    -
    <a href="http://flow-merge.com/">Website</a>
  </p>
</p>

# **👋 Welcome**

Model merging is an innovative technique that allows you to combine pre-trained and fine-tuned language models (LMs) into new models with unique capabilities.

This package is a fully open-source client that streamlines your merging operations with the convenience of a GUI interface. Underneath, `flow-merge-ui` is based on the [flow-merge](https://github.com/flowritecom/flow-merge) library.

`flow-merge` is a fully open-source library written in Python that implements some of the most popular merge methods such as model soups, SLERP, ties-MERGING or DARE. The library is built on top of the Hugging Face `transformers` library and the deep learning framework Pytorch, and provides a simple and easy-to-use interface to merge models and upload them to the Hugging Face Hub. Visit [flow-merge.com](http://flow-merge.com/) to learn more about the library.

# **⭐️ Features**

`flow-merge-ui` has been designed to expedite and streamline merging operations performed with the underlying `flow-merge` library. Hence, acting as an _experimentation lab_ for the library.

> Note: `flow-merge` is packaged with `flow-merge-ui` and hence is locked to a specific version.

The lab allows you to configure relevant parameters for the merge, such as:

- **Merging method**: The method with which to merge models.
- **Merging method parameters**: Fine tuning the method outcomes with respective paramenters. For example `top_k`, `scaling_coefficient`, and `drop_rate (p)`
- **Models**: Models to merge.
- **Tokenizer configuration**: Tokenizer _mode_ and _interpolation method_.

The key features of the lab consists of:

- **Pulling from Hugging Face Hub**: Integrates with HF hub and pulls a complete list of models available for merging. Downloads the model as pre-requisite step of the merging operation.
- **Pushing to Hugging face Hub**: Once a merge completes, you can easily push the merged model to your Hugging face registry.
- **Merge history**: Keep track of your recent merges, respective configurations and push merged models to HF hub with ease using a merge history candidate.
- **Logs and debugging**: Logs are propagated to the UI once a merge operation is in process.

# **🎉 Getting started**

## **🛠️ Project structure**

There are two primary services that make up this application. A python [Fast API](https://fastapi.tiangolo.com/) backend and a [Vue](https://vuejs.org/) UI served via nginx. The database is [SQLite](https://www.sqlite.org/).

    .
    ├── api                     # API directory
        ├── src                 # API files
        ├── .env.example        # Example env variables
        ├── Dockerfile          # Dockerfile for the API layer
    ├── app                     # UI directory
        ├── src                 # source files
        ├── .env.example        # Example env variables
        ├── Dockerfile          # Dockerfile that defines UI serving via nginx
    ├── docker-compose.yml      # Docker compose uses built images from <dir>/Dockerfile
    ├── LICENSE
    └── README.md

## **🏎️💨 Quick start**

1. Clone the repository and navigate to the root directory:

```bash
# via ssh
git clone git@github.com:flowritecom/flow-merge-ui.git

cd flow-merge-ui
```

2. Create a `.env` file for `app/.env` and `api/.env`. You can use the example environment files defined in the respective directories to populate the respective variables.

3. Run the complete client application using `docker` & `docker compose`. We've abstracted away the docker commands with `Makefile` rules:

```bash
# build the client and backend images
make
# run docker compose
make up
```

If make is not an option, simply build and run with docker & docker compose:

```bash
# from the root directory
docker build -t flow_merge_ui/frontend -f ./app/Dockerfile ./app
docker build -t flow_merge_ui/backend -f ./api/Dockerfile ./api
# run docker compose
docker compose -p flow_merge_ui -f docker-compose.yml up -d
```

Apply database migrations:

```bash
make docker-sqlite-migrate
```

To bring the migrations down:

```bash
make docker-sqlite-migrate-down
```

# **📚 Additional resources**

Visit the [flow-merge Github](https://github.com/flowritecom/flow-merge) page for details on the supported methods, LLM architectues, and properties of the methods.

# **🗺️ `flow-merge-ui` Roadmap**

Coming soon..

# **✨ Project showcase**

Coming soon..

# **🤝 Contributing**

Wanna pitch in? We're totally open to contributions for the core flow-merge library as well as any cool integrations built on top of it! Check out our [Contribution Guide](./CONTRIBUTING.md) for all the details on how to get started.
