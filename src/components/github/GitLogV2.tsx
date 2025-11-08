'use client';
import Paragraph from '@/components/prod/elements/Paragraph';
import HeaderWrapperMoments from '@/components/prod/hero-banners/wrappers/momentsWrappers/HeaderWrapperMoments';
import React, { useEffect, useState } from 'react';
import InlineFluidStylingWrapperStandard from '../fluid-typography/InlineFluidStylingWrapperStandard';

function processCommit(commitIn: string) {
    const commitCode = commitIn.match(/[0-9a-f]{40}/);
    const commitLink = `https://github.com/GLD5000/static-export/commit/${commitCode}`;
    const commitDev = 'Gareth D';
    const fileMatch = commitIn.match(/(\d+(?= files* changed))/);
    const filesChanged = fileMatch ? fileMatch[0] : 0;
    const insertionsMatch = commitIn.match(/(\d+(?= insertion))/) || 0;
    const insertions = insertionsMatch ? insertionsMatch[0] : insertionsMatch;
    const deletionsMatch = commitIn.match(/(\d+(?= deletion))/) || 0;
    const deletions = deletionsMatch ? deletionsMatch[0] : deletionsMatch;
    const dateMatch = commitIn.match(
        /(((Mon)|(Tue)|(Wed)|(Thu)|(Fri)|(Sat)|(Sun)) [a-zA-z]{3} [0-9]+ \d\d\:\d\d\:\d\d [0-9]{4})/
    );
    const dateLong = dateMatch ? dateMatch[0] : dateMatch;
    const [day, month, date, time, year] = dateLong
        ? dateLong.split(' ')
        : 'Fri Apr 12 11:49:58 2024'.split(' ');
    const merge = commitIn.match(/(Merge: [^\n^\r]+)/);
    const title = merge ? merge[0] : commitIn.split(/[\n\r]+/)[3]?.trim() || '';
    return {
        commitIn,
        commitCode,
        commitLink,
        commitDev,
        filesChanged,
        insertions,
        deletions,
        day,
        month,
        date,
        time,
        year,
        title,
    };
}

export default function GitLog() {
    const [logContent, setLogContent] = useState('');
    let linesOfCodeAdded = 0;
    let linesOfCodeRemoved = 0;
    let filesChangedTotal = 0;
    let daysOfCoding = 0;
    let currentDate = '';
    let monthsOfCoding = 0;
    let currentMonth = '';

    useEffect(() => {
        const loadLogFile = async () => {
            try {
                const response = await fetch('/stat.txt');
                if (!response.ok) {
                    throw new Error('Failed to fetch log file');
                }
                const text = await response.text();
                setLogContent(text);
            } catch (error) {
                console.error('Error fetching log file:', error);
            }
        };

        loadLogFile();
    }, []);
    const commitsArray = logContent
        .split(/commit (?=[0-9a-f]{40})/)
        .filter((string) => string !== '');

    const commitElements = commitsArray.map((commit, index, array) => {
        const {
            date,
            day,
            month,
            year,
            title,
            insertions,
            deletions,
            filesChanged,
            commitCode,
            // commitIn,
        } = processCommit(commit);
        const paragraphArray = [
            `${day} ${date} ${month} ${year}`,
            `Files Changed: ${filesChanged}`,
            `Lines of Code: +${insertions} -${deletions}`,
            // commitIn,
        ];
        linesOfCodeAdded += Number(insertions);
        linesOfCodeRemoved += Number(deletions);
        filesChangedTotal += Number(filesChanged);
        if (date !== currentDate) {
            currentDate = date;
            daysOfCoding += 1;
        }
        if (month !== currentMonth) {
            currentMonth = month;
            monthsOfCoding += 1;
        }

        return (
            <a
                href={`https://github.com/GLD5000/static-export/commit/${commitCode}`}
                key={`index-${commitCode}`}
                className="grid w-fit px-4 group"
                target="_blank"
            >
                <p
                    className={`transition group-focus:scale-105 group-hover:scale-105 w-fit max-w-full mx-auto text-black dark:text-white mt-[1em] font-bold text-xl underline underline-offset-8`}
                    key={`index-${index}`}
                >
                    {`${(array.length - index).toLocaleString()} - ${title}`}
                </p>
                {paragraphArray.map((paragraph) => (
                    <p
                        className={`transition group-focus:scale-105 group-hover:scale-105 w-fit max-w-full mx-auto text-black dark:text-white text-base`}
                        key={`index-${index}`}
                    >
                        {paragraph}
                    </p>
                ))}
            </a>
        );
    });
    const statsArray = [
        `Click to view on GitHub.`,
        `Project stats:`,
        `${(
            linesOfCodeAdded - linesOfCodeRemoved
        ).toLocaleString()} lines of code (${linesOfCodeAdded.toLocaleString()} added and ${linesOfCodeRemoved.toLocaleString()} removed) `,
        `${daysOfCoding} days of coding over ${monthsOfCoding} months.`,
        `${commitsArray.length.toLocaleString()} code updates and ${filesChangedTotal.toLocaleString()} file changes.`,
        `The project is written in 6 languages:`,
        `HTML, CSS, JavaScript, TypeScript, MDX, Batch Script`,
    ];
    return (
        <div>
            <InlineFluidStylingWrapperStandard>
                <a
                    className="group"
                    href="https://github.com/GLD5000/static-export/commits/main/"
                >
                    <HeaderWrapperMoments level={1}>
                        <span className="mx-auto w-fit block text-[100%] text-black dark:text-white font-bold underline transition group-focus:scale-105 group-hover:scale-105">
                            Github Commits
                        </span>
                    </HeaderWrapperMoments>
                    <Paragraph>
                        {statsArray.map((stat, index) => (
                            <span
                                key={`index-${index}`}
                                className="mx-auto w-fit block text-paragraphMobile md:text-paragraphTablet newDesktop:text-paragraphDesktop text-center text-black dark:text-white transition group-focus:scale-105 group-hover:scale-105 my-1"
                            >
                                {stat}
                            </span>
                        ))}
                    </Paragraph>
                </a>
                <div className="flex flex-wrap px-8 justify-center gap-2">
                    {commitElements}
                </div>
            </InlineFluidStylingWrapperStandard>
        </div>
    );
}
