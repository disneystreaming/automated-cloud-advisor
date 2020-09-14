const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')

const Container = CompLibrary.Container
const GridBlock = CompLibrary.GridBlock

class HomeSplash extends React.Component {
  render () {
    const { siteConfig, language = '' } = this.props
    const { baseUrl, docsUrl } = siteConfig
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
    const langPart = `${language ? `${language}/` : ''}`
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    )

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
        <small>{props.tagline}</small>
      </h2>
    )

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    )

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    )

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/logo.png`} />
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href={docUrl('start.html')}>Get Started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    )
  }
}

class Index extends React.Component {
  render () {
    const { config: siteConfig, language = '' } = this.props
    const { baseUrl } = siteConfig

    const Block = props => (
      <Container
        padding={[]}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    )

    const Features = () => (
      <Block layout="threeColumn">
        {[{
          content: 'Schedule a CloudWatch event to trigger Trusted Advisor.',
          image: `${baseUrl}img/trusted_advisor.png`,
          imageAlign: 'top',
          title: 'Refresh'
        }, {
          content: 'Index pattern based CloudWatch events to DynamoDB.',
          image: `${baseUrl}img/index_data.png`,
          imageAlign: 'top',
          title: 'Index'
        }, {
          content: 'Stream data and upsert/delete to Kibana.',
          image: `${baseUrl}img/view_data.png`,
          imageAlign: 'top',
          title: 'Stream'
        }]}
      </Block>
    )

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
        </div>
      </div>
    )
  }
}

module.exports = Index
