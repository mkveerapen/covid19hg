import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Container, Grid } from '../components/materialUIContainers'
import { Typography, Box } from '@material-ui/core'
import Analysis, { AlternatelyShadedTableRow } from './Analysis'
import GatsbyLink from 'gatsby-link'

import type { AnalysisProps } from './Analysis'

const releaseLeftColumnWidthXs = 12
const releaseRightColumnWidthXs = 12
const releaseLeftColumnWidthMd = 3
const releaseRightColumnWidthMd = 9

type Props = {
  notes: string
  title: string
  authors: {
    affiliation: string
    name: string
    study: string
  }[]
  data_columns: {
    column: string
    description: string
  }[]
  date: string
  studyAbbreviations: {
    abbreviation: string
    full_name: string
  }[]
  analyses: AnalysisProps[]
}

const Release = (release: Props) => {
  const abbreviationRows = release.studyAbbreviations.map(({ full_name, abbreviation }) => (
    <AlternatelyShadedTableRow key={abbreviation}>
      <TableCell component="th" scope="row">
        {full_name}
      </TableCell>
      <TableCell>{abbreviation}</TableCell>
    </AlternatelyShadedTableRow>
  ))

  const abbreviationTable = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Full Name</TableCell>
          <TableCell>Abbreviation</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{abbreviationRows}</TableBody>
    </Table>
  )

  const dataFieldRows = release.data_columns.map(({ column, description }) => (
    <AlternatelyShadedTableRow key={column}>
      <TableCell>{column}</TableCell>
      <TableCell>{description}</TableCell>
    </AlternatelyShadedTableRow>
  ))
  const dataFieldsTable = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="row">
            Column Name
          </TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{dataFieldRows}</TableBody>
    </Table>
  )

  const analysisElems = release.analyses.map((analysis) => (
    <Analysis analysis={analysis} key={analysis.name} />
  ))

  return (
    <Container disableGutters={true}>
      <Typography variant="h4">{release.title}</Typography>
      <Grid container={true} alignItems={'center' as const} spacing={2} marginTop={1}>
        <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
          <Typography variant="h6"> Release Date</Typography>
        </Grid>
        <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
          <Typography> {release.date}</Typography>
        </Grid>

        <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
          <Typography variant="h6">Study Abbreviations</Typography>
        </Grid>
        <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
          {abbreviationTable}
        </Grid>

        <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
          <Typography variant="h6">Data Columns</Typography>
        </Grid>
        <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
          {dataFieldsTable}
        </Grid>

        <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
          <Typography variant="h6">Release Notes</Typography>
        </Grid>
        <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
          <Typography> {release.notes}</Typography>
        </Grid>

        {release.date === 'January 18, 2021' && (
          <>
            <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
              <Typography variant="h6">Extras</Typography>
            </Grid>
            <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
              <Typography>
                <strong style={{ color: 'blue' }}>**New**</strong> the full downloads below do not contain the
                23andMe samples (the most well-powered analyses), however the top 10K SNPs from analyses that
                include 23andMe samples are available{' '}
                <a href="https://storage.googleapis.com/covid19-hg-public/20201215/results/20210107/COVID19_HGI_10k_SNPs.zip">
                  here.
                </a>
              </Typography>
              <Typography style={{ marginTop: 5 }}>
                There are additional leave-one-out results not listed here available at this storage bucket:{' '}
                <code>gs://covid19-hg-public/20201215/results/20210107</code>. You will need{' '}
                <a href="https://cloud.google.com/storage/docs/gsutil_install">gsutil</a> to list and download
                these files.
              </Typography>
            </Grid>
          </>
        )}

        {release.date == 'October 20, 2020' && (
          <Grid item={true} xs={12}>
            <Typography align="center" style={{ color: '#FF8C00' }}>
              Note: variants with heterogeneity p-value less than 0.001 across studies are in orange.
            </Typography>
          </Grid>
        )}

        {release.date == 'January 18, 2021' && (
          <Grid item={true} xs={12}>
            <Typography align="center" style={{ color: 'green' }}>
              Note: variants with heterogeneity p-value less than 0.001 across studies are in green.
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid container={true} marginTop={2} spacing={4}>
        {analysisElems}
      </Grid>

      <Box marginTop={2} padding={1}>
        <Typography variant="h6" gutterBottom={true}>
          <GatsbyLink to={'/acknowledgements'}>Contributing studies</GatsbyLink>
        </Typography>
      </Box>
    </Container>
  )
}

export default Release
