workflow "Publish GitHub Pages" {
  on = "push"
  resolves = [
    "Install",
    "Publish",
  ]
}

action "Install" {
  uses = "actions/npm@e7aaefe"
  args = "install"
}

action "Build" {
  uses = "actions/npm@e7aaefe"
  needs = ["Install"]
  args = "run build"
}

action "Publish" {
  uses = "dplusic/github-action-gh-pages@b45f32f"
  needs = ["Build"]
  secrets = ["GITHUB_TOKEN"]
  env = {
    PUBLIC_PATH = "dist"
  }
}
