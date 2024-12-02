import { Router } from "express";
import { RepositoryHash } from "../repository/implementations/repository-hash";

const router = Router();

const repositoryHash = new RepositoryHash();

// encurtar a url
router.post("/shorten_url", async (req, res) => {
  const { user_id, original_url } = req.body;

  const hash = await repositoryHash.createUserUrl(user_id, original_url);

  res.status(201).json({ url: `localhost:3333/${hash}` });
});

//redirect url
router.get("/:hash", async (req, res) => {
  const { hash } = req.params;

  const dados = await repositoryHash.seandByHash(hash);
  if (dados) {
    let link: any = "";
    const regex = /^(ftp|https?):\/\/$/;
    const string = String(dados.url_original).substring(0, 8);

    if (regex.test(string)) {
      link = dados?.url_original;
    } else {
      link = "https://" + dados?.url_original;
    }

    res.status(302).redirect(link);
  } else {
    res.status(404).send();
  }
});

router.get("/", async (req, res) => {
  res.send("Shortener URL Backend");
});

export { router };
