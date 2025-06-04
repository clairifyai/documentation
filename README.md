# To start mkdocs locally

1. Create a virtual environment: ```conda create --name docs```
1. Activate the virtual environment: ```conda activate docs```
1. Install these packages: ```pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin```
1. Run: ```mkdocs serve```

# To commit changes to the docs

We make the git commit history public on the homepage. This functions as our release notes for documentation. So, for each file that you change you should **commit separately**.
```
git commit -m 'Added a CNAME file to preserve the custom domain configuration.'
```

# To deploy the docs

1. Push your change: ```git push origin main```
2. In local, run: ```mkdocs deploy```
3. Go to docs.clairify.ai to observe your changes

> [!TIP]
> Not sure yet what the workflow is if you use branching.
