import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            username: 'neo2022',
            password: '$2a$13$UQu1RaDSJ4MjTqPYnAyUbuFEAWhPT/EnVG6h2i0l4AfNM3qEzR.hq'
        },
        {
            username: 'morpheus',
            password: '$2a$13$DelYS.pr9HJgClaVbfAvsO/pup58DOvNFQIlsTYJ1NxT20CsV/cU.'
        },
        {
            username: 'trinity',
            password: '$2a$13$NxTJ1SncgDll0fMSWwtLdemM/GM3zlCZOKI3sIuah0pyVWPbnWu7a'
        },
        {
            username: 'apoc0',
            password: '$2a$13$MIOFKHd1h6pTMRK/2Y4r6u82zyAcUkzenVieWj6RIXIcM0qtl0oQm'
        },
        {
            username: 'abrown',
            password: '$2a$13$qj1.jJYsTbzfFjHyZhgK6eSScxEhiQd9eJA3Y8md94YSinVApZ8ne'
        },
        {
            username: 'ajones',
            password: '$2a$13$sXyU.6ncvuHrxXy4Wx9y2e8pZk1Ol4r1Tj6HIAQHPZpjXCYDGM46O'
        },
        {
            username: 'choi',
            password: '$2a$13$pvEs0VIKBUxlI16j5JPgCe/.39mRBgy3Wc8zIvuaiCK3mUJbjhb06'
        },
        {
            username: 'dujour',
            password: '$2a$13$ssQV7KLSVgMRfC/GxlX7BughxTCwxc8c8d7dkL3SRN4W1UFRh75Ai'
        },
        {
            username: 'cypher',
            password: '$2a$13$CXSgxdmumOj0GnJnXP4Kb.LTSnRD4WuXRQ8VCzwlLdQfrchOwAKrK'
        },
        {
            username: 'dozer',
            password: '$2a$13$beDIKfjH4WmxEZGPghDc6.JllByf6ZY3NV87h3qq3LU8OxhOpt0dq'
        },
        {
            username: 'mouse',
            password: '$2a$13$qnDWaUMKVRneLcpbazbtEOBzKwdP1hHnT1Lc4kTTU475jJapLSfe.'
        },
        {
            username: 'oracle',
            password: '$2a$13$NVdcgz53wPMleaaKJrYObOTGJ8Hw22oqKVcys51urvPXOlXMbLhiG'
        },
        {
            username: 'rhineheart',
            password: '$2a$13$ltZ30oQjx5vzTSPiSIV1e.UBMGIGUYaifYrVzR45te0spRoCuR6QS'
        },
        {
            username: 'smith',
            password: '$2a$13$6s8eUtdj2gmCgO9IcWr4SO4dQrMmSiLXQgbEDBrWsrYvWJrQR2Ndq'
        },
        {
            username: 'tank',
            password: '$2a$13$6.A5NchchOa8G9ePQhamgO0gwh.9OVEU6ZXf0/jQDcKHRFrSklTMq'
        }
    ]);
};
