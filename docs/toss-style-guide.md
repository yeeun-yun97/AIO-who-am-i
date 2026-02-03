# 토스 스타일 가이드

토스인베스트 스타일의 깔끔하고 신뢰감 있는 UI 디자인 가이드입니다.

---

## 디자인 원칙

### 심플함
- 불필요한 요소 제거
- 핵심에 집중
- 한 화면에 하나의 목적

### 신뢰감
- 깔끔한 여백
- 명확한 정보 전달
- 일관된 시각적 언어

### 일관성
- 통일된 컴포넌트
- 일관된 색상 시스템
- 예측 가능한 인터랙션

---

## 색상 시스템 (라이트모드)

### Primary Colors
| 이름 | HEX | 용도 |
|------|-----|------|
| Primary Blue | `#3182F6` | 메인 버튼, 강조, CTA |
| Primary Hover | `#1B64DA` | 버튼 호버 상태 |

### Background & Surface
| 이름 | HEX | 용도 |
|------|-----|------|
| Background | `#FFFFFF` | 페이지 배경 |
| Surface | `#F4F4F4` | 카드 내부, 선택지 배경, 입력 필드 |

### Text Colors
| 이름 | HEX | 용도 |
|------|-----|------|
| Text Primary | `#191F28` | 제목, 본문 |
| Text Secondary | `#8B95A1` | 부가 설명, 캡션 |
| Text Tertiary | `#B0B8C1` | 힌트, 비활성 텍스트 |

### Utility Colors
| 이름 | HEX | 용도 |
|------|-----|------|
| Border | `#E5E8EB` | 테두리, 구분선 |
| Success | `#00C471` | 완료, 긍정, 성공 상태 |
| Error | `#F04452` | 에러, 경고 |

### CSS 변수
```css
:root {
  --primary: #3182F6;
  --primary-hover: #1B64DA;
  --background: #FFFFFF;
  --surface: #F4F4F4;
  --text-primary: #191F28;
  --text-secondary: #8B95A1;
  --text-tertiary: #B0B8C1;
  --border: #E5E8EB;
  --success: #00C471;
  --error: #F04452;
}
```

---

## 타이포그래피

### 폰트 패밀리
- **한글**: Pretendard
- **영문/숫자**: Inter (또는 Pretendard)
- **Fallback**: -apple-system, BlinkMacSystemFont, system-ui, sans-serif

### 폰트 사이즈 & Weight

| 용도 | 사이즈 | Weight | Line Height |
|------|--------|--------|-------------|
| 대제목 (H1) | 28-32px | Bold (700) | 1.4 |
| 제목 (H2) | 22-24px | Bold (700) | 1.4 |
| 소제목 (H3) | 18-20px | SemiBold (600) | 1.5 |
| 본문 | 16-18px | Regular (400) | 1.6 |
| 캡션 | 13-14px | Regular (400) | 1.5 |
| 힌트 | 12px | Regular (400) | 1.5 |

### 줄간격
- 제목: `1.4`
- 본문: `1.5 ~ 1.6`
- 캡션: `1.5`

---

## 간격 및 레이아웃

### 기본 단위
4px 배수 시스템 사용:
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px
```

### 컴포넌트 간격
| 요소 | 간격 |
|------|------|
| 카드 내부 패딩 | 24px |
| 섹션 간격 | 32-48px |
| 아이템 간격 (리스트) | 12-16px |
| 인라인 요소 간격 | 8-12px |

### 최대 너비
- 콘텐츠 영역: `480px ~ 560px`
- 전체 레이아웃: `1200px`

---

## 컴포넌트 스타일

### 버튼

#### Primary Button
```css
.button-primary {
  background: #3182F6;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 16px;
  transition: all 200ms ease;
}

.button-primary:hover {
  background: #1B64DA;
}

.button-primary:active {
  transform: scale(0.98);
}

.button-primary:disabled {
  background: #B0B8C1;
  cursor: not-allowed;
}
```

#### Secondary Button
```css
.button-secondary {
  background: #F4F4F4;
  color: #191F28;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 16px;
  transition: all 200ms ease;
}

.button-secondary:hover {
  background: #E5E8EB;
}
```

#### 버튼 사이즈
| 사이즈 | Padding | Font Size | Border Radius |
|--------|---------|-----------|---------------|
| Small | 8px 16px | 14px | 8px |
| Medium | 12px 20px | 15px | 10px |
| Large | 16px 24px | 16px | 12px |
| Full Width | 16px 24px | 16px | 12px |

### 카드

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E8EB;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

### 입력 필드

```css
.input {
  background: #F4F4F4;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #191F28;
  transition: all 200ms ease;
}

.input:focus {
  background: #FFFFFF;
  border-color: #3182F6;
  outline: none;
}

.input::placeholder {
  color: #B0B8C1;
}
```

### 선택지 버튼 (Radio/Option)

```css
.option-button {
  background: #F4F4F4;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  transition: all 200ms ease;
}

.option-button:hover {
  background: #E5E8EB;
}

.option-button.selected {
  background: rgba(49, 130, 246, 0.05);
  border-color: #3182F6;
}
```

### 프로그레스 바

```css
.progress-bar {
  height: 8px;
  background: #F4F4F4;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #3182F6;
  border-radius: 4px;
  transition: width 300ms ease;
}
```

---

## 애니메이션 & 트랜지션

### 기본 트랜지션
```css
/* 기본 */
transition: all 200ms ease;

/* 호버 효과 */
transition: all 150ms ease;

/* 페이지 전환 */
transition: all 300ms ease;

/* 프로그레스, 차트 */
transition: all 500ms ease-out;
```

### 인터랙션 효과

#### 버튼 클릭
```css
.button:active {
  transform: scale(0.98);
}
```

#### 호버 상태
```css
.interactive:hover {
  background: #E5E8EB;
}
```

#### 포커스 링
```css
.focusable:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #3182F6;
}
```

---

## Border Radius 가이드

| 요소 | Border Radius |
|------|---------------|
| 카드 | 16px |
| 버튼 (Large) | 12px |
| 버튼 (Medium) | 10px |
| 버튼 (Small) | 8px |
| 입력 필드 | 12px |
| 태그/뱃지 | 6px |
| 아바타/아이콘 (원형) | 50% |
| 프로그레스 바 | 4px |

---

## 그림자 (Shadows)

```css
/* 기본 카드 그림자 */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* 호버/활성 상태 */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

/* 모달/팝업 */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
```

---

## 접근성 (A11y)

### 포커스 상태
- 모든 인터랙티브 요소에 `:focus-visible` 스타일 적용
- 키보드 탐색 가능하도록 구현

### 색상 대비
- 텍스트 대비율 최소 4.5:1 (WCAG AA)
- Primary Blue(#3182F6)는 흰색 배경에서 충분한 대비 제공

### 터치 타겟
- 모바일 터치 영역 최소 44x44px

---

## 반응형 브레이크포인트

```css
/* Mobile */
@media (max-width: 639px) { }

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

### 권장 컨테이너 너비
- Mobile: 100% (패딩 16px)
- Tablet: 640px
- Desktop: 1024px ~ 1200px

---

## Tailwind CSS 설정 예시

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3182F6',
          hover: '#1B64DA',
        },
        surface: '#F4F4F4',
        border: '#E5E8EB',
        success: '#00C471',
        error: '#F04452',
        text: {
          primary: '#191F28',
          secondary: '#8B95A1',
          tertiary: '#B0B8C1',
        },
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
}
```

---

## 참고 자료

- [토스 디자인 시스템](https://toss.im/design)
- [토스인베스트](https://tossinvest.com)
- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
