source('init.R')

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
