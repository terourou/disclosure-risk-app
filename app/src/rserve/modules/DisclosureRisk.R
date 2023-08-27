calculate_risks <- function(conf) {

    if (is.null(conf$sfrac)) conf$sfrac <- 1

    sdc_data <- sdcMicro::createSdcObj(user_data, conf$vars)
    s2 <- sdcMicro::suda2(sdc_data, DisFraction = as.numeric(conf$sfrac))
    sd2 <- s2@risk$suda2

    list(
        var_contrib =
            with(sd2$attribute_contributions,
                lapply(seq_along(variable), function(i)
                    list(v = variable[i], c = contribution[i])
                )
            ),
        indiv_risk = sd2$disScore
    )
}
