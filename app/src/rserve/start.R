source("init.R")

conf <- readLines("rserve.conf.template")
conf <- gsub("$R_PORT", Sys.getenv("PORT", 8081), conf, fixed = TRUE)
writeLines(conf, "rserve.conf")

cat("Starting Rserve on port", Sys.getenv("R_PORT", 8081), "\n")

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
