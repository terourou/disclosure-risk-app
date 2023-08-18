source("init.R")

conf <- readLines("rserve.conf.template")
conf <- gsub("$PORT", Sys.getenv("PORT", 8081), conf, fixed = TRUE)
writeLines(conf, "rserve.conf")

Rserve::run.Rserve(
    config.file = "rserve.conf"
    # args = c(
    #     "--RS-conf", "rserve.conf",
    #     "--RS-source", "init.R",
    #     "--vanilla",
    #     "--no-save",
    #     "--silent"
    # )
)
