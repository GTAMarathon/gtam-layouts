import type { ReactNode } from 'react'
import { css, Global } from '@emotion/react'
import { render } from '../render'

function VCHundoRaceStyle({ children }: { children: ReactNode }) {
  return (
    <>
      <Global styles={css`
                @import url('../fonts/vcsans.css');
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    color: white;
                    font-weight: bold;
                    font-family: 'vice_city_sansregular';
                }

                #backgrounds {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: -1;
                }

                #backgrounds .bg {
                    position: absolute;
                }

                span.player_percentage {
                    font-size: 72px;
                    text-align: right;
                    color: lightblue;
                }

                #per_name,
                #per_score {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    font-weight: normal;
                    color: white;
                }

                #per_name {
                    font-size: 28px;
                }

                #per_score {
                    font-size: 24px;
                }

                #per_player_table {
                    text-align: center;
                    border: 0px;
                }

                .big {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    font-weight: normal;
                    color: white;
                    width: 192px;
                    height: 190px;
                }

                table.table-bordered {
                    table-layout: fixed;
                    font-family: 'Roboto';
                }

                table.table-bordered th {
                    border: 1px solid grey;
                    margin-bottom: 20px;
                }

                table.table-bordered th .table_pos {
                    margin-top: 5px;
                    font-size: 36px;
                    text-align: center;
                    vertical-align: middle;
                }

                table.table-bordered th .table_name {
                    font-size: 25px;
                    text-align: center;
                    vertical-align: middle;
                    margin: 0%;
                }

                table.table-bordered th .table_score {
                    margin-bottom: 40px;
                    font-size: 36px;
                    text-align: center;
                    vertical-align: middle;
                }
            `}
      />
      {children}
    </>
  )
}

export function VCHundoRace() {
  return <VCHundoRaceStyle><></></VCHundoRaceStyle>
}

render(<VCHundoRace />)
