'use client';
import Paragraph from '@/components/prod/elements/Paragraph';
import HeaderWrapperMoments from '@/components/prod/hero-banners/wrappers/momentsWrappers/HeaderWrapperMoments';
import React, { ReactNode, useEffect, useState } from 'react';
import InlineFluidStylingWrapperStandard from '../fluid-typography/InlineFluidStylingWrapperStandard';

export default function GitLog() {
    const [logContent, setLogContent] = useState('');

    useEffect(() => {
        const loadLogFile = async () => {
            try {
                const response = await fetch('/log.txt');
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
    const lineArray = logContent
        .replaceAll('+0000', '')
        .replaceAll('+0100', '')
        .replaceAll('<garethlouisdevlin@gmail.com>', '')
        .replaceAll('Author: ', '')
        .replaceAll('Date: ', '')
        .replaceAll('GLD5000', 'Gareth Devlin')
        .replaceAll('Devlin', 'D')
        .split(/[\n\r]+/);
    const commitsArray = logContent.match(/(commit [0-9a-f]{40})/g);
    const totalCommits = commitsArray ? commitsArray.length : 0;
    let currentCommit = totalCommits + 1;
    let commitIndex = -1;
    let commitCode = '';
    function incrementCommitIndex() {
        commitIndex = commitIndex + 1;
        currentCommit = currentCommit - 1;
    }
    function updateCommitCode(currentLine: string) {
        commitCode = currentLine.replace('commit ', '');
    }
    function getCurrentCommit() {
        return currentCommit;
    }
    function getCurrentCommitIndex() {
        return commitIndex;
    }
    function getCurrentCommitCode() {
        return commitCode;
    }
    const reducerAccumulator: {
        workingArray: ReactNode[];
        resultingArray: ReactNode[];
    } = { workingArray: [], resultingArray: [] };
    function logReducer(
        acc: typeof reducerAccumulator,
        line: string,
        index: number,
        arr: string[]
    ) {
        const isCommitHeader = line.length === 47 && line[0] === 'c';
        let currentLine = '';
        if (isCommitHeader) {
            currentLine = line;
            incrementCommitIndex();
        }
        const lineElement = (
            <p
                className={`transition group-focus:scale-105 group-hover:scale-105 w-fit max-w-full mx-auto text-black dark:text-white ${
                    isCommitHeader
                        ? 'mt-[1em] font-bold text-2xl underline underline-offset-8'
                        : 'text-xl'
                }`}
                key={`index-${index}`}
            >
                {isCommitHeader
                    ? `${line.replace(
                          /(commit [0-9a-f]{40})/,
                          `commit ${getCurrentCommit().toLocaleString()}`
                      )}`
                    : line}
            </p>
        );
        if ((index < 3 && isCommitHeader) || index === 0) {
            updateCommitCode(currentLine);
            acc.workingArray.push(lineElement);
        } else if (isCommitHeader) {
            acc.resultingArray.push(
                <a
                    href={`https://github.com/GLD5000/static-export/commit/${getCurrentCommitCode()}`}
                    key={`index-${getCurrentCommitIndex()}`}
                    className="grid w-fit px-4 group"
                    target="_blank"
                >
                    {acc.workingArray}
                </a>
            );
            acc.workingArray = [lineElement];
            updateCommitCode(currentLine);
        } else if (index === arr.length - 1) {
            acc.resultingArray.push(
                <a
                    href={`https://github.com/GLD5000/static-export/commit/${getCurrentCommitCode()}`}
                    key={`index-${getCurrentCommitIndex()} final`}
                    className="grid w-fit px-4 group"
                >
                    {acc.workingArray}
                </a>
            );
        } else {
            acc.workingArray.push(lineElement);
        }
        return acc;
    }
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
                        <span className="mx-auto w-fit block text-paragraphMobile md:text-paragraphTablet newDesktop:text-paragraphDesktop text-center text-black dark:text-white font-bold underline underline-offset-8 transition group-focus:scale-105 group-hover:scale-105">
                            Click to view on GitHub
                        </span>
                    </Paragraph>
                </a>
                <div className="flex flex-wrap px-8 justify-center gap-2">
                    {
                        lineArray.reduce(logReducer, reducerAccumulator)
                            .resultingArray
                    }
                    {/* {lineArray.map((line, index) => {
                    const isCommitHeader =
                        line.length === 47 && line[0] === 'c';
                    if (isCommitHeader) {
                        incrementCommitIndex();
                    }
                    return (
                        <p
                            className={`w-fit max-w-full mx-auto text-black dark:text-white ${
                                isCommitHeader
                                    ? 'mt-[3em] font-bold text-2xl underline underline-offset-8'
                                    : 'text-xl'
                            }`}
                            key={`index-${index}`}
                        >
                            {isCommitHeader
                                ? `${line.replace(
                                      /(commit [0-9a-f]{40})/,
                                      `commit ${getCurrentCommit().toLocaleString()}`
                                  )}`
                                : line}
                        </p>
                    );
                })} */}
                </div>
            </InlineFluidStylingWrapperStandard>
        </div>
    );
}
