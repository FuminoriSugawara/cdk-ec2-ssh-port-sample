import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {RemovalPolicy, Token} from 'aws-cdk-lib';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const sshPort = 10022;
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
    });

    const instanceSecurityGroup = new ec2.SecurityGroup(this, 'InstanceSecurityGroup', {
      vpc,
      securityGroupName: 'instance-sg',
    });

    instanceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(sshPort), 'Allow SSH(10022) from anywhere');

    // Prepare keypair.
    // Contents of PrivateKey are stored in SSM parameter store.
    const keyPair = new ec2.CfnKeyPair(this, 'KeyPair', {
      keyName: 'Ec2KeyPair',
    });
    keyPair.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.NANO),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-northeast-1': 'ami-0c7cb70d3eb61492b',
      }), // ubuntu 20.04
      keyName: Token.asString(keyPair.ref),
      securityGroup: instanceSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      `sed -i 's/^#Port 22$/Port ${sshPort}/g' /etc/ssh/sshd_config`,
      `service sshd restart`
    );
    instance.addUserData(userData.render());


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
