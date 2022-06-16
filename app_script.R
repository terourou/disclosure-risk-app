# 'dummy' script
cas <- iNZight::census.at.school.500 |> tibble::as_tibble()

vars <- c("travel", "gender", "getlunch")

# suda2 risk calculations:
sdc_data <- sdcMicro::createSdcObj(cas, vars)
s2 <- sdcMicro::suda2(sdc_data, DisFraction = 497/5000)
summary(s2@risk$suda2$disScore)

# disRisk
