const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function getPageContent(pageId) {
  let textContent = '';
  let hasMore = true;
  let startCursor = undefined;

  try {
    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
      });

      for (const block of response.results) {
        const type = block.type;
        if (block[type] && block[type].rich_text) {
          const text = block[type].rich_text.map(t => t.plain_text).join('');
          if (text) {
            if (type.startsWith('heading_')) {
              const level = type.split('_')[1];
              textContent += '\n' + '#'.repeat(parseInt(level)) + ' ' + text + '\n';
            } else if (type === 'bulleted_list_item') {
              textContent += '- ' + text + '\n';
            } else if (type === 'numbered_list_item') {
              textContent += '1. ' + text + '\n';
            } else if (type === 'quote') {
              textContent += '> ' + text + '\n';
            } else {
              textContent += text + '\n';
            }
          }
        }
      }

      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }
  } catch (error) {
    console.error(`❌ 블록 가져오기 실패 (ID: ${pageId}):`, error.message);
  }

  return textContent.trim();
}

async function syncNotionNotes() {
  console.log('🤖 [KODARI] 노션 노트 동기화를 시작합니다...');
  
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ 에러: NOTION_API_KEY가 .env 파일에 구성되지 않았습니다.');
    process.exit(1);
  }

  try {
    // 1. 전체 페이지 검색
    const searchResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
    });

    const notes = [];

    for (const page of searchResponse.results) {
      if (page.archived || page.in_trash) continue;

      // 제목 추출
      let title = '제목 없음';
      if (page.properties && page.properties.title && page.properties.title.title) {
        title = page.properties.title.title.map(t => t.plain_text).join('');
      } else if (page.properties && page.properties.Name && page.properties.Name.title) {
        title = page.properties.Name.title.map(t => t.plain_text).join('');
      } else if (page.properties && page.properties['이름'] && page.properties['이름'].title) {
        title = page.properties['이름'].title.map(t => t.plain_text).join('');
      }

      console.log(`📖 노트 파싱 중: "${title}"...`);

      // 본문 내용 추출
      const content = await getPageContent(page.id);

      notes.push({
        id: page.id,
        title: title,
        content: content,
        url: page.url,
        lastEdited: page.last_edited_time,
      });
    }

    // 2. 결과 저장 폴더 확보 및 쓰기
    const assetsDir = path.resolve(__dirname, '../src/assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    const outputPath = path.join(assetsDir, 'notion-notes.json');
    fs.writeFileSync(outputPath, JSON.stringify(notes, null, 2), 'utf-8');

    console.log(`\n✅ [KODARI SUCCESS] 총 ${notes.length}개의 노트를 성공적으로 동기화하여 파일에 저장했습니다!`);
    console.log(`📂 저장 위치: ${outputPath}`);

  } catch (error) {
    console.error('❌ 동기화 실패:', error);
  }
}

syncNotionNotes();
